export default new Map([

  /*
  |--------------------------------------------------------------------------
  | Use Meta Title Prefix
  |--------------------------------------------------------------------------
  |
  | whether to use prefix for meta title like Site name or similar
  | meta title will be appended to prefix with dash (-) as delimiter
  | example: Site Name - About Us
  |
  */
  ["use_meta_title_prefix", false],

  /*
  |--------------------------------------------------------------------------
  | Meta Title Key
  |--------------------------------------------------------------------------
  |
  | field code for meta title value
  |
  */
  ["meta_title_key", "meta_title"],

  /*
  |--------------------------------------------------------------------------
  | Meta Description Key
  |--------------------------------------------------------------------------
  |
  | field code for meta description value
  |
  */
  ["meta_description_key", "meta_description"],

  /*
  |--------------------------------------------------------------------------
  | OG Image Keys
  |--------------------------------------------------------------------------
  |
  | field codes for og image object value
  |
  */
  ["og_image_keys", ["og_image"]],

  /*
  |--------------------------------------------------------------------------
  | OG Image Version
  |--------------------------------------------------------------------------
  |
  | field code for og image version
  | if left empty or omitted, original image will be used
  |
  */
  ["og_image_version", ""],

  /*
  |--------------------------------------------------------------------------
  | Default OG Image
  |--------------------------------------------------------------------------
  |
  | URL for default OG Image (whole url: http://www.example.com/my_og_image.jpg)
  | If left empty or omitted, emtities that don't have og image will be left without it
  |
  */
  ["default_og_image", ""],

  /*
  |--------------------------------------------------------------------------
  | Localized Config
  |--------------------------------------------------------------------------
  |
  | You should define this set of values for each locale that you provide
  |
  */
  ["en_US", new Map([
    /*
    |--------------------------------------------------------------------------
    | Site Name
    |--------------------------------------------------------------------------
    |
    | Localized Site Name
    |
    */
    ["site_name", ""],

    /*
    |--------------------------------------------------------------------------
    | Meta Title Prefix
    |--------------------------------------------------------------------------
    |
    | When use_meta_title_prefix is set to TRUE, this value will be used as
    | prefix.
    |
    */
    ["meta_title_prefix", ""],

    /*
    |--------------------------------------------------------------------------
    | Default Meta Title
    |--------------------------------------------------------------------------
    |
    | Default meta title value, for entities that don't have meta title defined
    |
    */
    ["default_meta_title", ""],

    /*
    |--------------------------------------------------------------------------
    | Default Meta Description
    |--------------------------------------------------------------------------
    |
    | Default meta description value, for entities that don't have meta description defined
    |
    */
    ["default_meta_description", ""]
  ])],

])