const core = require('@actions/core');
const fetch = require('node-fetch');

const nakamaDevUrl = core.getInput('nakama-dev-server-url', { required: true});
const nakamaProdUrl = core.getInput('nakama-prod-server-url', { required: true});
const nakamaDevSystemUserId = core.getInput('nakama-dev-system-id', { required: true});
const nakamaDevAuthToken = core.getInput('nakama-dev-auth-token', { required: true});
const nakamaProdAuthToken = core.getInput('nakama-prod-auth-token', { required: true});
const nakamaSystemLoginId = core.getInput('nakama-system-login-id', { required: true});
const configurationKey = core.getInput('configuration-key', {required: true});
const configVersionsKey = core.getInput('config-versions-key', {required: true});


async function run() {
    const devBearerToken = await AuthNakama(nakamaDevUrl, nakamaDevAuthToken);
    const prodBearerToken = await AuthNakama(nakamaProdUrl, nakamaProdAuthToken);
    const devConfigVersions = await GetStorageData(nakamaDevUrl, devBearerToken, configurationKey, configVersionsKey, nakamaDevSystemUserId);

    const versions = JSON.parse(devConfigVersions.objects[0].value).versions;

    for (const key in versions)
    {
        var values = versions[key];
        for (const value in values)
        {
            let dataKey = key + '_' + values[value];
            let dataIncluded = moveableData.includes(dataKey);

            if (dataIncluded) continue;

            moveableData.push(dataKey);

            let dataJson = await GetStorageData(nakamaDevUrl, devBearerToken, configurationKey, dataKey, nakamaDevSystemUserId);
            let data = '';
            if (dataJson.objects && dataJson.objects.length > 0 && dataJson.objects[0].value)
            {
                data = dataJson.objects[0].value;
            }
            else
            {
                console.error(`Unexpected data structure or missing data for key: ${dataKey}`, dataJson);
                continue;
            }

            await PutStorageData(nakamaProdUrl, prodBearerToken, configurationKey, dataKey, data);
        }
    }
}

async function AuthNakama(nakamaUrl, authToken) {

    var authUrl = 'https://' + nakamaUrl + '/v2/account/authenticate/device?create=true&username=SYSTEM';

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');
    requestHeaders.append('Authorization', authToken);

    const payload = {
        id: nakamaSystemLoginId
    }

    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetch(authUrl, requestOptions);
        const responseContent = await response.json();

        return `Bearer ${responseContent.token}`;
    } catch (error) {
        console.error('Error during authentication:', error);
    }
}

async function GetStorageData(nakamaUrl, bearerToken, collection, key, userId) {
    const storageUrl = 'https://' + nakamaUrl + '/v2/storage';

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');
    requestHeaders.append('Authorization', bearerToken);

    const getStorageData = {
        collection: collection,
        key: key,
        user_id: userId
    }
    const payload = {
        object_ids: [getStorageData]
    }

    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(storageUrl, requestOptions);
        const responseContent = await response.json();

        console.log(responseContent);

        return responseContent;
    } catch (error) {
        console.error('Error during GetStorageData:', error);
    }
}

async function PutStorageData(nakamaUrl, bearerToken, collection, key, data) {
    const storageUrl = 'https://' + nakamaUrl + '/v2/storage';

    const requestHeaders = new Headers();
    requestHeaders.append('Content-Type', 'application/json');
    requestHeaders.append('Authorization', bearerToken);

    const putStorageData = {
        collection: collection,
        key: key,
        value: data,
        permissionRead: 2,
        permissionWrite: 1,
    }

    const payload = {
        objects: [putStorageData]
    }

    const requestOptions = {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(payload)
    }

    try {
        const response = await fetch(storageUrl, requestOptions);
        const responseContent = await response.json();

        console.log('put storage data response: ' + responseContent);

        return responseContent;
    } catch (error) {
        console.error('Error during PutStorageData:', error);
    }
}

run();
