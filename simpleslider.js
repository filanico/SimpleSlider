export function LightSlider({
    selector,
    page = 1,
    slidesPerPage = 1,
    slideImageWidth = 500,
    autoPlay = true,
    autoPlayDelay = 3000,
    arrows = false,
    pages = false,
}) {
    let _slider = document.querySelector(selector);
    let _body = _slider.querySelector('.body');
    let _slides = _slider.querySelector('.slides');
    let _slideImages = _slides.querySelectorAll('img');
    let _slideImageWidth = slideImageWidth || parseFloat(_slideImages[0].width);
    let _slideImageHeight = _slideImages[0].height;
    let _totPages = Math.ceil(_slideImages.length / slidesPerPage);
    let _autoPlayHandler = null;
    let pagesContainer = null;

    let update = () => {
        _slides.style.marginLeft = ((page - 1) * (_slideImageWidth * -1)) + "px";
        let e = new Event('simple-slide-update');
        _slides.dispatchEvent(e);
    }

    let createArrow = (html, classes) => {
        let arrow = document.createElement('div');
        arrow.innerHTML = html;
        arrow.classList.add(...classes);
        return arrow;
    }

    let onManualChange = (page) => {
        clearInterval(_autoPlayHandler);
    }

    let manageArrows = () => {
        if (arrows) {
            // GENERATING arrows
            let arrow_left = createArrow('&lt;', ['arrow', 'prev']);
            let arrow_right = createArrow('&gt;', ['arrow', 'next']);
            _body.prepend(arrow_left);
            _body.append(arrow_right);
            arrow_left.addEventListener('click', () => {
                onPrev();
                onManualChange(page);
            });
            arrow_right.addEventListener('click', () => {
                onNext();
                onManualChange(page);
            });
        }
    }
    let managePages = () => {
        if (pages) {
            let pages = document.createElement('div');
            pages.classList.add('pages');
            pagesContainer = document.createElement('div');
            pagesContainer.classList.add(...['pages-container'])
            pagesContainer.style.width = (_slideImageWidth - 4) + "px";
            let onBlockClick = (pPageNum) => {
                page = pPageNum;
                update();
            }
            for (let pageNum = 1; pageNum <= _totPages; pageNum++) {
                let block = document.createElement('div');
                block.addEventListener('click', () => onBlockClick(pageNum));
                block.classList.add(...['page']);
                pages.append(block);
            }
            pagesContainer.append(pages);
            _slider.append(pagesContainer);
            _slides.addEventListener('simple-slide-update', () => {
                [...pagesContainer.querySelectorAll('.page')].forEach(pageNode => pageNode.classList.remove('current'));
                pagesContainer.querySelector('.page:nth-child(' + page + ')').classList.add('current');
            })
        }
    }
    let init = () => {
        _slideImages.forEach(img => img.style.width = (_slideImageWidth / slidesPerPage) + "px");
        _body.style.width = (_slideImageWidth) + "px";
        _slides.style.height = (_slideImageHeight) + "px";

        if (autoPlay) {
            _autoPlayHandler = setInterval(() => {
                onNext();
            }, autoPlayDelay);
        }

        manageArrows();
        managePages();
        update();
    }
    let onNext = () => {
        page++;
        if (page > _totPages) {
            page = 1;
        }
        update();
    }
    let onPrev = () => {
        page--;
        if (page < 1)
            page = 1;
        update();
    }
    autoPlayDelay = autoPlayDelay < 500 ? 500 : autoPlayDelay;
    init();
}
