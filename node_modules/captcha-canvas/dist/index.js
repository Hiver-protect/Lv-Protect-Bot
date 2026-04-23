"use strict";
/**
 * Main entry point for the captcha-canvas library.
 *
 * This library provides a comprehensive solution for generating secure CAPTCHA images
 * using the skia-canvas module. It offers both simple function-based and advanced
 * class-based APIs for creating customizable CAPTCHAs with various security features.
 *
 * @example Basic usage with simple functions
 * ```typescript
 * import { createCaptcha } from 'captcha-canvas';
 *
 * const { image, text } = createCaptcha(300, 100);
 * console.log('CAPTCHA text:', text);
 * // Save the image buffer to file or send to client
 * ```
 *
 * @example Advanced usage with CaptchaGenerator class
 * ```typescript
 * import { CaptchaGenerator } from 'captcha-canvas';
 *
 * const captcha = new CaptchaGenerator()
 *   .setDimension(400, 150)
 *   .setCaptcha({ text: 'SECURE', size: 60, color: '#ff6b6b' })
 *   .setTrace({ color: '#4ecdc4', size: 4 });
 *
 * const buffer = await captcha.generate();
 * console.log('CAPTCHA text:', captcha.text);
 * ```
 *
 * @author Shashank3736
 * @since 3.3.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaGenerator = exports.Captcha = exports.resolveImage = exports.createCaptchaSync = exports.createCaptcha = void 0;
// Simple function-based API for quick CAPTCHA generation
var extra_1 = require("./extra");
Object.defineProperty(exports, "createCaptcha", { enumerable: true, get: function () { return extra_1.createCaptcha; } });
Object.defineProperty(exports, "createCaptchaSync", { enumerable: true, get: function () { return extra_1.createCaptchaSync; } });
// Re-export skia-canvas loadImage as resolveImage for convenience
var skia_canvas_1 = require("skia-canvas");
Object.defineProperty(exports, "resolveImage", { enumerable: true, get: function () { return skia_canvas_1.loadImage; } });
// Core classes for advanced CAPTCHA generation
var captcha_1 = require("./captcha");
Object.defineProperty(exports, "Captcha", { enumerable: true, get: function () { return captcha_1.Captcha; } });
var CaptchaGenerator_1 = require("./CaptchaGenerator");
Object.defineProperty(exports, "CaptchaGenerator", { enumerable: true, get: function () { return CaptchaGenerator_1.CaptchaGenerator; } });
