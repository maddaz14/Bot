import fetch from 'node-fetch';

async function ensureTmpFolder(githubToken, repoOwner, repoName) {
    try {
        const checkUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/tmp`;
        const checkResponse = await fetch(checkUrl, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (checkResponse.status === 404) {
            const initResponse = await fetch(`${checkUrl}/.gitkeep`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: 'Init tmp folder by Alicia',
                    content: Buffer.from('').toString('base64'),
                }),
            });

            if (!initResponse.ok) {
                const errorText = await initResponse.text();
                throw new Error(`Gagal bikin folder tmp: ${initResponse.status} - ${errorText}`);
            }
        } else if (!checkResponse.ok) {
            throw new Error(`Gagal cek folder tmp: ${checkResponse.status}`);
        }
    } catch (error) {
        throw error;
    }
}

async function getFileSha(githubToken, repoOwner, repoName, fileName) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/tmp/${fileName}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            return data.sha;
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function uploadToGitHub(fileBuffer, fileName, githubToken, repoOwner, repoName) {
    try {
        const fileContent = fileBuffer.toString('base64');
        const sha = await getFileSha(githubToken, repoOwner, repoName, fileName);

        const body = {
            message: `Upload ${fileName} via upgh by Alicia`,
            content: fileContent,
        };

        if (sha) {
            body.sha = sha;
            body.message = `Update ${fileName} via upgh by Alicia`;
        }

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/tmp/${fileName}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.content.download_url;
    } catch (error) {
        throw error;
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const githubToken = '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';
    const repoOwner = 'Ponta22';
    const repoName = 'ngetes';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Reply file yang mau diupload ke GitHub pake ${usedPrefix}${command}, Senpai!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '📤', key: m.key } });

        await ensureTmpFolder(githubToken, repoOwner, repoName);

        let media = await q.download();
        let fileExt = mime.split('/')[1] || 'bin';
        
        let fileName = args.length > 0 ? `${args.join('')}.${fileExt}` : `upload_${Date.now()}.${fileExt}`;

        let fileUrl = await uploadToGitHub(media, fileName, githubToken, repoOwner, repoName);

        let caption = args.length > 0 
            ? 'File udah diupload ke GitHub, kalo udah ada ya keganti, Senpai!' 
            : 'File udah diupload pake nama default, Senpai!';
        await conn.sendMessage(m.chat, { text: `${caption}\nLink: ${fileUrl}` }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Waduh, error nih, Senpai: ${error.message}`);
    }
};

handler.help = ['upgh <nama_file>'];
handler.tags = ['owner'];
handler.command = /^up(github|gh)$/i;
handler.owner = true;

export default handler;