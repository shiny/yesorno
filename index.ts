import { $ } from "bun"
const port = process.env.PORT || 3000
const server = Bun.serve({
    port,
    async fetch(request) {
        const outputText = await $`df -P | awk 'NR > 1'`;
        const result = format(outputText.stdout.toString())
        const url = new URL(request.url)
        const searchParams = new URLSearchParams(url.search)
        console.log(searchParams)
        const fs = searchParams.get('filesystem')
        const minfree = searchParams.get('minfree')
        let status = 200
        if (fs && minfree) {
            const drive = result.find(drive => drive.filesystem === fs)
            if (drive && drive.free < parseInt(minfree)) {
                status = 500
            }
        }
        return new Response(JSON.stringify(result), {
            headers: {
                'content-type': 'application/json'
            },
            status
        });
    },
})

console.log(`Listening on http://0.0.0.0:${server.port}`);
function format(stdout: string) {
    var aLines = stdout.split('\n');
    // For each line get drive info and add to array

    type Drive = {
        filesystem: string
        blocks: number
        used: number
        available: number
        free: number
        capacity: string
        mounted: string
    }
    const aDrives: Drive[] = []
    for(var i = 0; i < aLines.length; i++) {					
        var sLine = aLines[i];
        if (sLine != '') {
            sLine = sLine.replace(/ +(?= )/g,'');
            var aTokens = sLine.split(' ');
            const blocks = parseInt(aTokens[1])
            const used = parseInt(aTokens[2])
            const available = parseInt(aTokens[3])
            aDrives[aDrives.length] = {
                filesystem:	aTokens[0],
                blocks,
                used,
                available,
                free: Math.ceil((available / (available + used)) * 100),
                capacity:	aTokens[4],
                mounted:	aTokens[5]
            };
            
        }
    }
    return aDrives
}