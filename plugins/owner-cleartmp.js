import cp from 'child_process';
import { promisify } from 'util';

const exec = promisify(cp.exec).bind(cp);

const formatSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let numSize = parseFloat(size);

    while (numSize >= 1024 && index < units.length - 1) {
        numSize /= 1024;
        index++;
    }

    return `${numSize.toFixed(2)} ${units[index]}`;
};

const handler = async (m) => {
    try {
        const countOutput = await exec('find tmp -type f | wc -l');
        const fileCountBefore = parseInt(countOutput.stdout.trim(), 10);

        if (fileCountBefore === 0) {
            await conn.reply(m.chat, "Tidak ada file sampah di direktori tmp.", floc);
            return;
        }

        const sizeOutput = await exec('du -sb tmp/* 2>/dev/null | awk \'{sum+=$1} END {print sum}\' || echo "0"');
        const sizeBefore = sizeOutput.stdout.trim() || '0';

        await exec('rm -rf tmp/*');

        const sizeAfter = '0';
        const totalDeleted = fileCountBefore;

        const formattedSizeBefore = formatSize(sizeBefore);

        await conn.reply(m.chat, `Deleted:\n- Size of files before: ${formattedSizeBefore}\n- Total files deleted: ${totalDeleted}\n- Size after: 0 B\nDone`, floc);
    } catch (error) {
        await conn.reply(m.chat, `An error occurred: ${error.message}`, floc);
    }
};

handler.help = ['cleartmp'];
handler.tags = ['owner'];
handler.command = /^(cleartmp|deltmp)$/i;
handler.owner = true;

export default handler;