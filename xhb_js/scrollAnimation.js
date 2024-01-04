


var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid;


if (!isMobile) {

//    const css = '.wl-editor {background-image: url(/img/open.webp);background-size: 10%, 10%;background-repeat: no-repeat;background-position: right bottom;background-color: rgba(255, 255, 255, 0);resize: vertical}.wl-editor:focus {background-image: url(/img/close.webp);background-size: 10%, 10%;background-repeat: no-repeat;background-position: right bottom;background-color: rgba(255, 255, 255, 0);resize: vertical}'
//    const $style = document.createElement('style');
//    $style.type = 'text/css';
//    $style.textContent = css;
//    document.body.appendChild($style);


    const cards = document.querySelectorAll('.index-card')
    if (cards.length) {
        document.querySelector('.row').setAttribute('style', 'overflow: hidden;')
        const coefficient = document.documentElement.clientWidth > 768 ? .5 : .3
        const origin =
            document.documentElement.clientHeight -
            cards[0].getBoundingClientRect().height * coefficient
        function throttle(fn, wait) {
            let timer = null
            return function () {
                const context = this
                const args = arguments
                if (!timer) {
                    timer = setTimeout(function () {
                        fn.apply(context, args)
                        timer = null
                    }, wait)
                }
            }
        }
        function handle() {
            cards.forEach((card) => {
                card.setAttribute(
                    'style',
                    `--state: ${card.getBoundingClientRect().top - origin < 0 ? 1 : 0};`
                )
            })
        }
        document.addEventListener('scroll', throttle(handle, 100))
    }
}

