import useAxiosOriginal from "axios-hooks";
import { useState, useEffect } from "react";
import Axios from "axios";
const axios = Axios.create({
  baseURL: "https://www.flickr.com/services/rest"
});
useAxiosOriginal.configure({ axios });

const parseString = require("react-native-xml2js").parseString;
const parseXML2JSON = xml =>
  new Promise((resolve, reject) => {
    parseString(xml, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

/**
 * @description Used as a wrapper for use-axios to convert data into JSON from XML
 *
 * @param {XML} params
 * @returns {JSON}
 */
const normalizeResult = (params, options) => {
  const [{ data, loading, error }, fetch] = params;
  const [normaliseData, setNormalizedData] = useState();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(loading);
  }, [loading]);
  useEffect(() => {
    (async () => {
      setLoading(false);
      try {
        let result_ = await parseXML2JSON(data);
        const allPhotos = result_.rsp.photos[0].photo.map(({ "$": info }) => {
          let data = { ...info, url: getSingleImagesUrl(info, options?.size) };
          return data;
        });
        const photoInfo = result_.rsp.photos[0].$;
        let result = { data: allPhotos, ...photoInfo };
        setNormalizedData(result);
      } catch (err) {
        setNormalizedData(data);
      }
      setLoading(false);
    })();
  }, [data]);
  return [{ data: normaliseData, loading: isLoading, error }, fetch];
};

const useAxios = (...params) => {
  const result = useAxiosOriginal(...params);
  return normalizeResult(result, params);
};
/*************************************** FUNCTIONS ************************************/
const sizes = ["w", "l"];
const getSingleImagesUrl = (imageData, size) => {
  const { secret, server, id } = imageData || {};
  if (!id || !secret || !server) {
    throw new Error("INVALID INFO -- getSingleImagesUrl");
  }
  size = sizes[size || 0];
  return `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
};

const fetchImages = () => {
  return useAxios(
    {
      url: "/",
      method: "POST",
      params: {
        per_page: 50,
        method: "flickr.photos.getRecent",
        api_key: "dfcb71b020c43fc837d4f01f8e5fac7d"
      }
    },
    { manual: true }
  );
};
export { fetchImages, getSingleImagesUrl };

let z = {
  "rsp": {
    "$": { "stat": "ok" },
    "photos": [
      {
        "$": { "page": "1", "pages": "334", "perpage": "3", "total": "1000" },
        "photo": [
          {
            "$": {
              "id": "51927168707",
              "owner": "192430235@N04",
              "secret": "acf54eca50",
              "server": "65535",
              "farm": "66",
              "title": "20220309_090723",
              "ispublic": "1",
              "isfriend": "0",
              "isfamily": "0"
            }
          },
          {
            "$": {
              "id": "51928143031",
              "owner": "40498517@N04",
              "secret": "fc48abf8c9",
              "server": "65535",
              "farm": "66",
              "title": "Sloop Institute 2022-167.jpg",
              "ispublic": "1",
              "isfriend": "0",
              "isfamily": "0"
            }
          },
          {
            "$": {
              "id": "51928485114",
              "owner": "192326824@N02",
              "secret": "9e1c5b0748",
              "server": "65535",
              "farm": "66",
              "title": "6228c6b725c7f.jpg",
              "ispublic": "1",
              "isfriend": "0",
              "isfamily": "0"
            }
          }
        ]
      }
    ]
  }
};
