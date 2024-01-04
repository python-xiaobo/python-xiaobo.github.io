


var ua = navigator.userAgent;
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid;


if (!isMobile) {

    const css = '.index-card {transition: all 0.5s;transform: scale(calc(1.5 - 0.5 * var(--state)));opacity: var(--state);margin-bottom: 2rem;}.index-img img {margin: 20px 0;transition: .4s;opacity:0.7;filter: blur(1px);-webkit-filter: blur(1px);-moz-filter: blur(1px);-o-filter: blur(1px);-ms-filter: blur(1px);}.index-card:hover .index-img img{transform: scale(1.08);    /*放大倍数*/opacity:1.0;filter: blur(0);-webkit-filter: blur(0);-moz-filter: blur(0);-o-filter: blur(0);-ms-filter: blur(0);}';
    const $style = document.createElement('style');
    $style.type = 'text/css';
    $style.textContent = css;
    document.body.appendChild($style);


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

