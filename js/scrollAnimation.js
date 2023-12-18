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
        `--state: ${card.getBoundingClientRect().top - origin < 0 ? 1 : 1.5};`/*原来是1:0（动画效果从左边划入）,但是手机端看不见所以调整为1:1.5，降低了动画效果（见网站） */
      )
    })
  }

  document.addEventListener('scroll', throttle(handle, 100))
}
