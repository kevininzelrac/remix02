import { request, gql } from "graphql-request";

//const region = process.env.AWS_REGION as any;
const endpoint = process.env.AWS_APPSYNC_GRAPHQLENDPOINT as any;
const apiKey = process.env.AWS_APPSYNC_KEY as any;

const headers = {
  //"x-api-key": apiKey,
  authorization:
    "eyJraWQiOiJUY0l1c24zeDhvRGJ0b0FTVWVaY3FcL29WVXlyXC9PcnVudkFoV3VGeFh2U2s9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIyMDVjNjllYy0xMGYxLTcwM2QtZDUxNy0zMWVjNDI4YTVkM2UiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtbm9ydGgtMS5hbWF6b25hd3MuY29tXC9ldS1ub3J0aC0xX3oyc2x6cmNtRSIsImNsaWVudF9pZCI6IjI1MzJvbHA5NXIwOHF2ajEydThqZjhudnZvIiwib3JpZ2luX2p0aSI6IjllYmIzM2YxLWUxZjUtNDU1My1hNTk2LTNkYmI3YTUxZmFkOCIsImV2ZW50X2lkIjoiNzcwMWU4YmYtMWQ2Yy00MTQ1LThjYmItYTc3YWVhYWZmNzE5IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY4NzA1MzE2NiwiZXhwIjoxNjg3MDUzNDY2LCJpYXQiOjE2ODcwNTMxNjYsImp0aSI6IjU5YWU5YzgwLTI4ZjMtNDFmNS1iMTgwLTA0OGEyMDkwZmU5MiIsInVzZXJuYW1lIjoiMjA1YzY5ZWMtMTBmMS03MDNkLWQ1MTctMzFlYzQyOGE1ZDNlIn0.EPGtwN5A3DsWYJcI_DDUTWAlwqInq2Sz3PvAtoz7Boy2WoUVHxnD2U8jU3zTHzWsjUMLVlrER1fISv-JPdq4QDkKcFWthZe1nV5Ps6ExoVMVoMN06We1lIT1uYPicxt5iiTfOB_OfPylXunFkx6APmPoXC2ot0k7jCLxGXZOmmP5HA8zLdLOd_T0Ctie_Q8gkiXXS3gkHcp4nuSEpXeGhd0ADwkFC5Qd7V0D5loyj8QntDxFMfCt4WT25K8JUpugGLrFh22CnJ-_chjhhBidA3OtIifbFWXyXsWtmNtRyQg2RmZWxMp77oDUHjvZLf50doRjTSv_ykFgwzQgBBVYFg",
};

const userMessages = gql`
  query MyQuery($from: String!) {
    getAllMessages(from: $from) {
      messages {
        id
        date
        from
        to
        message
        status
      }
    }
  }
`;

const variables = { from: "Kevin" };

export const graph = async () => {
  try {
    const response: any = await request(
      endpoint,
      userMessages,
      variables,
      headers
    );
    const { messages } = await response.getAllMessages;
    console.log(messages);
  } catch (error) {
    console.log("Erreur:", error);
  }
};
