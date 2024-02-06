import * as fs from 'fs';
import * as path from 'path';

export const isProd = process.env.NODE_ENV === 'production';

function parseEnv() {
  const devEnv = path.resolve('.env');
  const devEnvLocal = path.resolve('.env.local');
  const prodEnv = path.resolve('.env.prod');
  const prodEnvLocal = path.resolve('.env.prod.local');
  let envPath: string;
  if (!isProd) {
    envPath = !fs.existsSync(devEnvLocal) ? devEnv : devEnvLocal;
  } else {
    envPath = !fs.existsSync(prodEnvLocal) ? prodEnv : prodEnvLocal;
  }

  if (!fs.existsSync(envPath)) {
    throw new Error('缺少环境配置文件');
  }
  return { path: envPath };
}

export default parseEnv();
