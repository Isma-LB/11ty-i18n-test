const ImgShortcodes = function () {
  const Image = require("@11ty/eleventy-img");
  const path = require("path");
  function generateImgHTML(metadata, imgAttr) {
    let attr = Object.entries(imgAttr)
      .map((entry) => {
        let [key, value] = entry;
        return `${key}="${value}"`;
      })
      .join(" ");
    return `<img srcset="${Object.values(metadata)
      .map((format) => format.map((entry) => entry.srcset).join(", "))
      .join(", ")}" ${attr ? `${attr}` : ""}/>`;
  }
  function customFilenameFormat(id, src, width, format, options) {
    const extension = path.extname(src);
    const name = path.basename(src, extension);
    return `${name}-${width}w.${format}`;
  }
  async function imageShortcode(src, alt, sizes, classes, widths) {
    let metadata = await Image(src, {
      widths: widths,
      formats: ["jpeg"],
      urlPath: "/assets/img/",
      outputDir: "./public/assets/img",
      filenameFormat: customFilenameFormat,
    });
    let imageAttributes = {
      alt,
      sizes,
      class: classes,
      loading: "lazy",
      decoding: "async",
    };

    return generateImgHTML(metadata, imageAttributes);
  }
  return {
    bannerImg: async function (src, alt, sizes = "100w", classes = "") {
      let widths = [640, 960, 1200, 1800, 2400, 3600];
      return imageShortcode(src, alt, sizes, classes, widths);
    },
    galleryImg: async function (src, alt, sizes = "100w", classes = "") {
      let widths = [450, 960, 1200];
      return imageShortcode(src, alt, sizes, classes, widths);
    },
    cardImg: async function (src, alt, sizes = "100w", classes = "") {
      let widths = [320, 640, 960];
      return imageShortcode(src, alt, sizes, classes, widths);
    },
    regularImg: async function (src, alt, sizes = "100w", classes = "") {
      let widths = [400, 800, 1200];
      return imageShortcode(src, alt, sizes, classes, widths);
    },
  };
};

module.exports = function (eleventyConfig) {
  const MarkdownIt = require("markdown-it");
  const mdRender = new MarkdownIt();
  eleventyConfig.addFilter("markdown", function (rawString) {
    if (typeof rawString === "string") {
      return mdRender.render(rawString);
    } else {
      return " ";
    }
  });

  eleventyConfig.addPassthroughCopy("./src/admin");
  const imgShortcodes = ImgShortcodes();
  eleventyConfig.addNunjucksAsyncShortcode("bannerImage", imgShortcodes.bannerImg);
  eleventyConfig.addNunjucksAsyncShortcode("galleryImage", imgShortcodes.galleryImg);

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
