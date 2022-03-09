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
          // let data = { ...info, url: getSingleImagesUrl(info, options?.size) };
          return info;
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

const fetchImages = ({ page = 1 } = {}) => {
  return useAxios(
    {
      url: "/",
      method: "POST",
      params: {
        per_page: 1000,
        page,
        method: "flickr.photos.getRecent",
        api_key: "dfcb71b020c43fc837d4f01f8e5fac7d",
        extras: "title, tags, description, url_w, url_o",
        safe_search: 3
      }
    },
    { manual: true }
  );
};
export { fetchImages, getSingleImagesUrl };
