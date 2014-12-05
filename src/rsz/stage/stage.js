goog.provide('rsz.Stage');

/**
 * Stage class handles the website in the iframe
 * @class
 * @export
 */
class Stage {
  /**
   * @constructor
   * @param {HTMLElement} element in which to display the website
   * @param {HTMLIFrameElement} iframe
   */
  constructor(element, iframe) {
    /**
     * the container for this component
     * @type {HTMLElement}
     */
    this.element = element;


    /**
     * @type {HTMLIFrameElement}
     */
    this.iframe = iframe;


    /**
     * @type {number}
     */
    this.width = 1;


    /**
     * @type {number}
     */
    this.height= 1;


    // init
    window.addEventListener('resize', this.redraw.bind(this));
  }


  /**
   * change the rendering size of the website
   * @param {number} w
   * @param {number} h
   * @export
   */
  setSize(w, h) {
    // store the new size
    this.width = w;
    this.height = h;
    // refresh display
    this.redraw();
  }


  /**
   * refresh display
   * apply the real size to the iframe
   * use css transform to fit the container
   * @export
   */
  redraw() {
    // apply the real size
    this.iframe.style.width = this.width + 'px';
    this.iframe.style.height = this.height + 'px';
    // det the scale to fit the container
    let container = {
      w: this.element.offsetWidth,
      h: this.element.offsetHeight
    };
    let scale = {
      x: container.w / this.width,
      y: container.h / this.height
    };
    let finalScale = Math.min(1, scale.x, scale.y);
    // apply the transform
    let str = 'scale(' + finalScale + ')';
    this.iframe.style.transform = str;
    this.iframe.style.transformOrigin = '0 0';
    // center in the container
    let offset = {
      x: (container.w - (this.width * finalScale)) / 2,
      y: (container.h - (this.height * finalScale)) / 2
    };
    this.iframe.style.left = offset.x + 'px';
    this.iframe.style.top = offset.y + 'px';
  }


  /**
   * @param {string} url
   * @return {Promise}
   * @export
   */
  setUrl(url) {
    let promise = new Promise((resolve, reject) => {
      this.iframe.onload = () => resolve(this.iframe.contentDocument);
      this.iframe.src = url;
    });
    return promise;
  }
}
