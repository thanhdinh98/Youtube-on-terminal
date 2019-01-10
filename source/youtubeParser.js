const fetch = require('node-fetch');
const queryString = require('querystring');

const Parser = async (videoId, apiKey)=>{
    try{
        const embedFileResponse = await fetch(`https://www.youtube.com/embed/${videoId}`, {mode: 'no-cors'});
        const embedFile = await embedFileResponse.text();
        const embedFileInfo = JSON.parse(`{
            ${/"js":.*\/base\.js"/.exec(embedFile)[0]},
            ${/"sts":[0-9]*/.exec(embedFile)[0]}
        }`);

        let metaDataResponse = await fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}&sts=${embedFileInfo.sts}`, {mode: 'no-cors'});
        let metaData = await metaDataResponse.text();
        let streamMap = queryString.parse(
            queryString.parse(metaData, null, null).url_encoded_fmt_stream_map,
            null, null
        );
        if(streamMap = '{}'){
            metaDataResponse = await fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}&sts=${embedFileInfo.sts}&el=detailpage`, {mode: 'no-cors'});
            metaData = await metaDataResponse.text();
            streamMap = queryString.parse(
                queryString.parse(metaData, null, null).url_encoded_fmt_stream_map,
                null, null
            );  
        }

        return streamMap.url[0];
    }catch(err){throw err;}
}

module.exports.Parser = Parser;