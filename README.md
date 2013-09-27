# Contrast Checker

A bookmarklet that shows the contrast ratio of the current element and its background. Based on W3C's [Web Content Accessibility Guidelines 2.0](http://www.w3.org/TR/WCAG20/).

![](https://s3.amazonaws.com/cyclinganalytics/static/contrast-checker.png)

## What is this?

Sometimes you see a webpage where there just isn't enough contrast between the text and the background. It turns out that it's possible to quantify how much contrast there is, and W3C specifies both how to do this, and [recommedations](http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast) for how much contrast there should be.

This bookmarklet, once activated, shows the contrast ratio between the element the mouse is over and its background. The contrast ratio is a ratio between 1:1 (where background and foreground are the same) and 21:1 (black on white or vice versa).

The [contrast ratio](http://www.w3.org/TR/WCAG20/#contrast-ratiodef) is based on the ratio of the [relative luminance](http://www.w3.org/TR/WCAG20/#relativeluminancedef) of the two colours, which is assuming the RGB values are for the sRGB colour space, which should be the case for web content.

## W3C recommendations

 | Normal | Large scale
---: | :---: | :---:
Minimum | 4.5:1 | 3:1
Enhanced | 7:1 | 4.5:1

Text is defined as [large scale](http://www.w3.org/TR/WCAG20/#larger-scaledef) when it is 18pt (24px) or larger, or when it is bold and 14pt (~18.7px) or larger.

The minimum values are the minimum contrast ratios for an AA level of conformance, while the enhanced values are the minimum contrast ratios for an AAA level of conformance.

Text that is part of a logo, an inactive UI component, or existing only for decorative purposes has no contrast requirements.

## Limitations

* This is intended for regularly weighted fonts (i.e., traditional websafe fonts like Arial and Georgia). Many modern web fonts and lighter and need more contrast to compensate.
* This requires a solid opaque background to work. Transparency, gradiants and background images are not supported.
* When there are CSS hover effects, the colour on hover is used.
* `:visited` styles are not taken into account, as it is impossible to read these styles for security reasons.
* This doesn't work for iframes.
* This doesn't work on some sites like Facebook and GitHub because they employ Content Security Policy directives to whitelist JavaScript source locations.

## Usage

To use this, create a bookmark for:

    javascript:(function(){var newscript=document.createElement('script');newscript.type='text/javascript';newscript.async=true;newscript.src='https://s3.amazonaws.com/cyclinganalytics/static/contrast-checker.js';(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(newscript);})();
    
(I'd create a link that can be dragged to the bookmarks toolbar, except GitHub doesn't allow that.)

Alternatively, to use this on a particular page, open up the developer tools JavaScript console and run the previous line of code (without the `javascript:` beginning).

## About me

I'm [David Johnstone](http://davidjohnstone.net). I keep myself busy building [Cycling Analytics](https://www.cyclinganalytics.com/), a website for cyclists. I can be found on Twitter as [@cyclist_dave](https://twitter.com/cyclist_dave), or emailed at [david@davidjohnstone.net](mailto:david@davidjohnstone.net).

## License

MIT
