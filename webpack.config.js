import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: "production",
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: "/",
        filename: "index.js"
    },
    target: 'node'
};