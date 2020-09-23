let slider = document.querySelector('.slider');
let categories = document.querySelectorAll('.slides-category')
let sliderCategoryBtns = document.querySelectorAll('.category');
let currentCategory = 0;
let currentSlide = 0;
let isEnabled = true;
let isNewCategory = false;
let sliderDots;
const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
const clickEvent = !!supportsTouch ? 'touchend' : 'click';

const createDots = () => {
	const dotContainer = document.createElement('div');
	let maxDots = 0;
	for (let i = 0; i < categories.length; i++) {
		if (maxDots < categories[i].children[0].querySelectorAll('.slide').length) {
			maxDots = categories[i].children[0].querySelectorAll('.slide').length;
		}
	}
	dotContainer.classList.add('slider__dots');
	for (let k = 0; k < maxDots; k++) {
		const dot = document.createElement('div');
		dot.classList.add('slider__dot');
		dot.dataset.dotNumber = k;
		if(k===0) dot.classList.add('chosen')
		dotContainer.append(dot);
	}
		slider.append(dotContainer);
}
createDots();

sliderDots = document.querySelectorAll('.slider__dot');

const displayDots = (quantity) => {
	for (let k = 0; k < sliderDots.length; k++) {
		sliderDots[k].classList.remove('active');
	}
	for (let i = 0; i < quantity; i++) {
		sliderDots[i].classList.add('active');
	}
}
displayDots(categories[currentCategory].children[0].querySelectorAll('.slide').length)

const changeCurrentCategory = (a) => {
	currentCategory = (a + categories.length) % categories.length;
	isNewCategory = true;
}

const changeCurrentSlide = (a) => {
	if (a > categories[currentCategory].children[0].querySelectorAll('.slide').length-1) {
		changeCurrentCategory(currentCategory + 1)
		currentSlide = 0;
		categories[currentCategory].children[0].querySelectorAll('.slide')[currentSlide].classList.toggle('active',true)
	}
	else if (a < 0) {
		changeCurrentCategory(currentCategory - 1)
		currentSlide = categories[currentCategory].children[0].querySelectorAll('.slide').length - 1;
		categories[currentCategory].children[0].querySelectorAll('.slide')[currentSlide].classList.toggle('active',true)
	}
	else currentSlide = a;
}

const hideSlide = (direction) => {
	let slide = categories[currentCategory].children[0].querySelectorAll('.slide')[currentSlide];
	isEnabled = false;
	slide.classList.add(direction);
	removeChosenDotClass();
	slide.addEventListener('animationend', function hide() {
		this.classList.remove('active', direction);
		slide.removeEventListener('animationend',hide)
	});
}

const showSlide = (direction) => {
	let slide = categories[currentCategory].children[0].querySelectorAll('.slide')[currentSlide];
	if (isNewCategory) {
		slide.classList.add('nextCategory', direction);
		removeCurrentBtnsClass();
		document.querySelector('.slider__categories').children[currentCategory].classList.add('current');
		displayDots(categories[currentCategory].children[0].querySelectorAll('.slide').length);
		isNewCategory = false;
	}
	else slide.classList.add('next', direction);
	sliderDots[currentSlide].classList.add('chosen')
	slide.addEventListener('animationend', function show() {
		this.classList.remove('next', direction, 'nextCategory');
		this.classList.add('active');
		isEnabled = true;
		slide.removeEventListener('animationend',show)
	});
}

const nextSlide = (n) => {
	hideSlide('to-left');
	changeCurrentSlide(n + 1);
	showSlide('from-right');
}

const previousSlide = (n) => {
	hideSlide('to-right');
    changeCurrentSlide(n - 1);
	showSlide('from-left');
}

const showSpecificSlide = (n) => {
	let hideDirection = currentSlide >= n ? 'to-right':'to-left';
	let showDirection = currentSlide >= n ? 'from-left':'from-right';
	hideSlide(hideDirection);
	changeCurrentSlide(n);
	showSlide(showDirection);
}

for (let i = 0; i < sliderDots.length; i++) {
	let dot = sliderDots[i];
	dot.addEventListener(clickEvent,function(e) {
		if (isEnabled && currentSlide !== +e.target.dataset.dotNumber) {
			showSpecificSlide(+e.target.dataset.dotNumber)
		}
	})
}

const removeCurrentBtnsClass = () => {
	for (let k = 0; k < sliderCategoryBtns.length; k++) {
		if (sliderCategoryBtns[k].classList.contains('current')) {
			sliderCategoryBtns[k].classList.remove('current');
		}
	}
}

const removeChosenDotClass = () => {
	for (let k = 0; k < sliderDots.length; k++) {
		if (sliderDots[k].classList.contains('chosen')) {
			sliderDots[k].classList.remove('chosen');
		}
	}
}

for (let i = 0; i < sliderCategoryBtns.length; i++) {
	let categoryBtn = sliderCategoryBtns[i];
	categoryBtn.addEventListener(clickEvent, function() {
		if (currentCategory === +categoryBtn.dataset.categoryNumber && currentSlide === 0) return;
		let hideDirection = currentCategory >= +categoryBtn.dataset.categoryNumber ? 'to-right':'to-left';
		let showDirection = currentCategory >= +categoryBtn.dataset.categoryNumber ? 'from-left':'from-right';
		removeCurrentBtnsClass();
		categoryBtn.classList.add('current');
		hideSlide(hideDirection);
		if (currentCategory !== +categoryBtn.dataset.categoryNumber) {
			isNewCategory=true;
			currentCategory = +categoryBtn.dataset.categoryNumber
		}
		else {
			currentCategory = +categoryBtn.dataset.categoryNumber
		};
		currentSlide=0;
		showSlide(showDirection);
	})
}

document.querySelector('.slider__arrow_left').addEventListener(clickEvent, function() {
	if (isEnabled) {
		previousSlide(currentSlide);
	}
});

document.querySelector('.slider__arrow_right').addEventListener(clickEvent, function() {
	if (isEnabled) {
		nextSlide(currentSlide);
	}
});


const swipedetect = (el) => {

	let surface = el;
	let startX = 0;
	let startY = 0;
	let distX = 0;
	let distY = 0;
	let startTime = 0;
	let elapsedTime = 0;
	let threshold = 150;
	let restraint = 100;
	let allowedTime = 300;

	surface.addEventListener('mousedown', function(e){
		startX = e.pageX;
		startY = e.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);

	surface.addEventListener('mouseup', function(e){
		distX = e.pageX - startX;
		distY = e.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				if ((distX > 0)) {
					if (isEnabled) {
						previousSlide(currentSlide);
					}
				} else {
					if (isEnabled) {
						nextSlide(currentSlide);
					}
				}
			}
		}
		e.preventDefault();
	}, false);

	surface.addEventListener('touchstart', function(e){
		if (e.target.classList.contains('arrow') || e.target.classList.contains('arrow-block')) {
			if (e.target.classList.contains('left')) {
				if (isEnabled) {
					previousSlide(currentSlide);
				}
			} else {
				if (isEnabled) {
					nextSlide(currentSlide);
				}
			}
		}
			var touchobj = e.changedTouches[0];
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime();
			e.preventDefault();
	}, false);

	surface.addEventListener('touchmove', function(e){
			e.preventDefault();
	}, false);

	surface.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0];
			distX = touchobj.pageX - startX;
			distY = touchobj.pageY - startY;
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime){
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
							if ((distX > 0)) {
								if (isEnabled) {
									previousSlide(currentSlide);
								}
							} else {
								if (isEnabled) {
									nextSlide(currentSlide);
								}
							}
					}
			}
			e.preventDefault();
	}, false);
}
swipedetect(slider);