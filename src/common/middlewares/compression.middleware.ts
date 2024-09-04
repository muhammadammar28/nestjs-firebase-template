import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { gzip } from 'zlib';
import { promisify } from 'util';
import * as process from 'node:process';

const gzipAsync = promisify(gzip);

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const encodings = req.headers['encoding'] || '';
    const shouldCompress = encodings.includes('gzip');

    // Intercept the response before it's sent
    const originalSend = res.send.bind(res);

    res.send = (body: any): Response => {
      if (typeof body === 'object') {
        body = JSON.stringify(body);
      }

      if (
        Buffer.byteLength(body, 'utf8') >
          (Number(process.env.COMPRESSION_THRESHOLD) || 5120) &&
        shouldCompress
      ) {
        gzipAsync(body)
          .then((compressedData) => {
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', compressedData.length);

            // Send the compressed data
            originalSend(compressedData);
          })
          .catch((err) => {
            console.error('Compression error:', err);
            // If compression fails, send the original body
            return originalSend(body);
          });

        // Return immediately to avoid blocking
        return res;
      } else {
        // Send uncompressed data
        return originalSend(body);
      }
    };

    next();
  }
}
