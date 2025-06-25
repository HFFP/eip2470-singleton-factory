const TAG = '[erc2470]';
const COLORS = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
};

export function strongInfo(msg: string) {
    console.log(`${COLORS.cyan}${TAG} 💡 ${msg}${COLORS.reset}`);
}

export function strongWarn(msg: string) {
    console.warn(`${COLORS.yellow}${TAG} ⚠️ ${msg}${COLORS.reset}`);
}

export function strongError(msg: string) {
    console.error(`${COLORS.red}${TAG} ❗ ${COLORS.bold}${msg}${COLORS.reset}`);
}
