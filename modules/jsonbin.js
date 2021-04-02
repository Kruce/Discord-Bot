const Fetch = require(`node-fetch`);

const basicHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Master-Key': process.env.JSONBIN_API_KEY,
})

async function ReadBin(id, version = `latest`) {
    const result = await Fetch(`https://api.jsonbin.io/v3/b/${id}/${version}`, {
        headers: basicHeaders(),
    })
    if (!result.ok) throw new Error('readBin Error: ' + (await result.text()))
    return await result.json()
}

async function UpdateBin(id, content, shouldDoVersioning = true) {
    const headers = {
        ...basicHeaders(),
        'X-Bin-Versioning': shouldDoVersioning ? 'true' : 'false',
    }
    const result = await Fetch(`https://api.jsonbin.io/v3/b/${id}`, {
        method: 'put',
        body: JSON.stringify(content),
        headers,
    })
    if (!result.ok) throw new Error('updateBin Error: ' + (await result.text()))
    return await result.json()
}
module.exports = {
    ReadBin,
    UpdateBin
}