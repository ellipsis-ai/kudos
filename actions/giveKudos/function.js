function(name, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const storageApi = new EllipsisApi(ellipsis).storage;

const giver = ellipsis.userInfo.userName;
const recipient = name.replace(/^@/, "");
storageApi.query({
  query: `
mutation GiveKudos($kudos: KudosInput!) {
  createKudos(kudos: $kudos) {
    id
    recipient
    giver
    timestamp
  }
}
`,
  variables: {
    kudos: {
      recipient: recipient,
      giver: giver,
      timestamp: Date.now()
    }
  }
}).then((result) => {
  return storageApi.query({
    query: `
query MeasureKudos($filter: KudosInput!) {
  kudosList(filter: $filter) {
    recipient
    timestamp
  }
}`, variables: {
      filter: {
        recipient: recipient
      }
    }
  });
}).then((result) => {
  ellipsis.success({
    giver: giver,
    recipient: recipient,
    count: result.data.kudosList.length
  });
});
}
