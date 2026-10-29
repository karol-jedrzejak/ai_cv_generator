import { lookup } from 'node:dns/promises';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REDIRECTS = 5;
const REQUEST_TIMEOUT_MS = 10_000;

interface DownloadedResponse {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

@Injectable()
export class JobOfferTextService {
  async downloadText(urlValue: string): Promise<string> {
    let url = this.parsePublicUrl(urlValue);

    for (let redirects = 0; ; redirects += 1) {
      const addresses = await this.resolvePublicAddresses(url.hostname);
      const response = await this.request(url, addresses[0].address);

      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        const location = response.headers.location;
        if (typeof location !== 'string' || redirects >= MAX_REDIRECTS) {
          throw new BadGatewayException(
            'The job offer URL returned an invalid or excessive redirect',
          );
        }

        const redirectUrl = this.parsePublicUrl(
          new URL(location, url).toString(),
        );
        if (url.protocol === 'https:' && redirectUrl.protocol !== 'https:') {
          throw new BadGatewayException(
            'The job offer URL redirected to an insecure connection',
          );
        }
        url = redirectUrl;
        continue;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new BadGatewayException(
          `The job offer URL returned HTTP ${response.statusCode}`,
        );
      }

      const contentType = response.headers['content-type'];
      const contentTypeValue = Array.isArray(contentType)
        ? contentType[0]
        : contentType;
      const contentEncoding = response.headers['content-encoding'];
      if (contentEncoding && contentEncoding !== 'identity') {
        throw new BadGatewayException(
          'The job offer URL returned unsupported compressed content',
        );
      }
      if (
        contentTypeValue &&
        !/^(text\/(plain|html)|application\/xhtml\+xml)(;|$)/i.test(
          contentTypeValue,
        )
      ) {
        throw new BadGatewayException(
          'The job offer URL did not return HTML or plain text',
        );
      }

      return this.extractText(response.body);
    }
  }

  private parsePublicUrl(value: string): URL {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new BadRequestException('The job offer URL is invalid');
    }

    if (
      !['http:', 'https:'].includes(url.protocol) ||
      !url.hostname ||
      url.username ||
      url.password ||
      (url.port && Number(url.port) !== (url.protocol === 'https:' ? 443 : 80))
    ) {
      throw new BadRequestException(
        'The job offer URL must be a public HTTP or HTTPS address',
      );
    }
    return url;
  }

  private async resolvePublicAddresses(hostname: string) {
    let addresses: Array<{ address: string; family: number }>;
    try {
      addresses = await lookup(hostname, { all: true, verbatim: true });
    } catch {
      throw new BadGatewayException(
        'The job offer URL host could not be resolved',
      );
    }

    const publicAddresses = addresses.filter(
      ({ address, family }) => family === 4 && this.isPublicIpv4(address),
    );
    if (publicAddresses.length === 0) {
      throw new BadRequestException(
        'The job offer URL must resolve to a public IPv4 address',
      );
    }
    return publicAddresses;
  }

  private isPublicIpv4(address: string): boolean {
    const octets = address.split('.').map(Number);
    if (
      octets.length !== 4 ||
      octets.some(
        (octet) => !Number.isInteger(octet) || octet < 0 || octet > 255,
      )
    ) {
      return false;
    }

    const [first, second, third] = octets;
    return !(
      first === 0 ||
      first === 10 ||
      first === 127 ||
      first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && (second === 0 || second === 168)) ||
      (first === 192 && second === 88 && third === 99) ||
      (first === 198 && (second === 18 || second === 19)) ||
      (first === 198 && second === 51 && third === 100) ||
      (first === 203 && second === 0 && third === 113)
    );
  }

  private request(url: URL, address: string): Promise<DownloadedResponse> {
    return new Promise((resolve, reject) => {
      const requestFunction =
        url.protocol === 'https:' ? httpsRequest : httpRequest;
      const request = requestFunction(
        {
          protocol: url.protocol,
          hostname: address,
          port: url.port || undefined,
          path: `${url.pathname}${url.search}`,
          method: 'GET',
          servername: url.protocol === 'https:' ? url.hostname : undefined,
          headers: {
            Host: url.host,
            Accept: 'text/html, text/plain, application/xhtml+xml',
            'Accept-Encoding': 'identity',
            'User-Agent': 'AI-CV-Generator/1.0',
          },
        },
        (response) => {
          const chunks: Buffer[] = [];
          let size = 0;
          response.on('data', (chunk: Buffer | string) => {
            const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            size += buffer.length;
            if (size > MAX_RESPONSE_BYTES) {
              response.destroy(
                new Error('Job offer page exceeds the allowed size'),
              );
              return;
            }
            chunks.push(buffer);
          });
          response.on('end', () => {
            resolve({
              statusCode: response.statusCode ?? 502,
              headers: response.headers,
              body: Buffer.concat(chunks).toString('utf8'),
            });
          });
          response.on('error', () => {
            reject(
              new BadGatewayException(
                'Could not read the downloaded job offer page',
              ),
            );
          });
        },
      );

      request.setTimeout(REQUEST_TIMEOUT_MS, () => {
        request.destroy(new Error('Job offer page request timed out'));
      });
      request.on('error', () => {
        reject(
          new BadGatewayException('Could not download the job offer page'),
        );
      });
      request.end();
    });
  }

  private extractText(body: string): string {
    const text = body
      .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, '\n')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;|&#160;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;|&#34;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&#(\d+);/g, (_match, code: string) =>
        this.decodeCodePoint(Number(code)),
      )
      .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
        this.decodeCodePoint(Number.parseInt(code, 16)),
      )
      .replace(/[ \t\f\v]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!text) {
      throw new BadGatewayException(
        'The job offer page did not contain readable text',
      );
    }
    return text.slice(0, MAX_RESPONSE_BYTES);
  }

  private decodeCodePoint(codePoint: number): string {
    return codePoint <= 0x10ffff &&
      !(codePoint >= 0xd800 && codePoint <= 0xdfff)
      ? String.fromCodePoint(codePoint)
      : '\uFFFD';
  }
}
