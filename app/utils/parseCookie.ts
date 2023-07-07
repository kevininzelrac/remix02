const parseCookie = (cookie: string | null) => {
  const pairs: any = cookie?.split(";");
  var parsedCookie: any = {};
  for (var i = 0; i < pairs.length; i++) {
    var key = pairs[i].split("=");
    parsedCookie[key[0].trim()] = key[1];
  }
  return parsedCookie;
};
export default parseCookie;
