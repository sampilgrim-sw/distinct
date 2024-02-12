(function setUp() {
	/* GSAP */
	gsap.registerPlugin(ScrollTrigger);
	gsap.registerPlugin(ScrollSmoother);
	gsap.registerPlugin(SplitText);
	gsap.registerPlugin(Draggable);
	gsap.registerPlugin(InertiaPlugin);
	gsap.registerPlugin(Flip);

	gsap.defaults({
		ease: "power2.out",
		duration: 0.5,
	});

	ScrollTrigger.normalizeScroll(true);

	/* basic smooth scroll implementation */
	// ScrollSmoother.create({
	// 	smooth: 1,
	// 	effects: true,
	// });
	let smoother = ScrollSmoother.create({
		smooth: 1,
		effects: true,
		normalizeScroll: true,
	});

	/* Splide */
	Splide.defaults = {
		perMove: 1,
		gap: "0rem",
		arrows: false,
		pagination: false,
		focus: 0,
		speed: 600,
		dragAngleThreshold: 60,
		rewind: false,
		rewindSpeed: 400,
		waitForTransition: false,
		updateOnMove: true,
		trimSpace: "move",
		type: "loop",
		drag: true,
		snap: true,
		autoWidth: false,
		autoplay: true,
		interval: 5000,
	};
})();

/* progress bar */
function splide_progress(splide_instance) {
	let bar = splide_instance.root.querySelector(".slider-progress_bar");
	// Updates the bar width whenever the carousel loads and updates:
	splide_instance.on("ready active", function () {
		let end = splide_instance.Components.Controller.getEnd() + 1;
		let rate = Math.min((splide_instance.index + 1) / end, 1);
		bar.style.width = String(100 * rate) + "%";
	});
}

/* homepage services */
function mount_splide_home_services(myClass) {
	let splides = document.querySelectorAll(myClass);
	for (let i = 0; i < splides.length; i++) {
		let splide = new Splide(splides[i], {
			perMove: 1,
			gap: "1rem",
			focus: 0,
			speed: 600,
			dragAngleThreshold: 60,
			perPage: 3,
			rewindSpeed: 400,
			waitForTransition: false,
			updateOnMove: true,
			trimSpace: "move",
			type: "loop",
			drag: true,
			snap: true,
			autoplay: false,
			arrows: true,
			breakpoints: {
				767: { perPage: 1 },
				991: { perPage: 2 },
			},
		});

		splide_progress(splide); /* add progress bar */
		splide.on("mounted", function () {
			Webflow.require("ix2").init();
		});
		splide.mount();
	}
}
mount_splide_home_services(".splide.is-home-services");

/* homepage testimonials */
function mount_splide_home_testimonials(myClass) {
	let splides = document.querySelectorAll(myClass);
	for (let i = 0; i < splides.length; i++) {
		let splide = new Splide(splides[i], {
			perMove: 1,
			gap: "1rem",
			focus: 0,
			speed: 600,
			dragAngleThreshold: 60,
			perPage: 1,
			rewindSpeed: 400,
			waitForTransition: false,
			updateOnMove: true,
			trimSpace: "move",
			type: "loop",
			drag: true,
			snap: true,
			autoplay: false,
			arrows: true,
		});

		splide_progress(splide); /* add progress bar */
		splide.on("mounted", function () {
			Webflow.require("ix2").init();
		});
		splide.mount();
	}
}
mount_splide_home_testimonials(".splide.is-home-testimonials");

/* hero slider on homepage */
function mount_splide_home_hero(myClass) {
	let splides = document.querySelectorAll(myClass);
	for (let i = 0; i < splides.length; i++) {
		let splide = new Splide(splides[i], {
			type: "loop",
			rewind: true,
			pauseOnHover: false,
			pauseOnFocus: false,
			gap: "0rem",
			autoplay: true,
		});

		var toggleButton = document.querySelector(".splide-button");
		var buttonPause = toggleButton.querySelector(".splide-button_pause");
		var buttonPlay = toggleButton.querySelector(".splide-button_play");

		/* get all videos within slider */
		var videosContainer = document.querySelector(".home-hero");
		var videos = videosContainer.querySelectorAll("video");
		/* get progress bar */
		var progressBar = document.querySelector(".splide-button_progress-circle");

		/* add pause/play functionality */
		splide.on("autoplay:play", function () {
			toggleButton.setAttribute("aria-label", "Pause autoplay");
			buttonPlay.style.display = "none";
			buttonPause.style.display = "block";
		});

		splide.on("autoplay:pause", function () {
			toggleButton.setAttribute("aria-label", "Start autoplay");
			buttonPause.style.display = "none";
			buttonPlay.style.display = "block";
		});
		splide.on("autoplay:playing", function (rate) {
			progressBar.style.strokeDashoffset = rate;
		});

		/* when pause/play button is clicked */
		toggleButton.addEventListener("click", function () {
			var Autoplay = splide.Components.Autoplay;

			/* if splide is currently paused */
			if (Autoplay.isPaused()) {
				/* play autoplay */
				Autoplay.play();
				/* also get any onscreen videos and play them */
				videos.forEach((video) => {
					if (
						video.paused &&
						video.closest(".splide__slide").classList.contains("is-active")
					) {
						video.play();
					}
				});
			} else {
				Autoplay.pause();
				videos.forEach((video) => {
					if (
						!video.paused &&
						video.closest(".splide__slide").classList.contains("is-active")
					) {
						video.pause();
					}
				});
			}
		});

		splide.mount();
	}
}
mount_splide_home_hero(".splide.is-home-hero");

/* sticky home hero */
function stickyHomeHero() {
	ScrollTrigger.create({
		trigger: ".s-home-intro",
		start: "top 100%",
		end: "top 0%",
		scrub: true,
		pin: ".s-home-hero",
		pinSpacing: false,
	});
}

/* split text */
function splitText() {
	const splitTexts = document.querySelectorAll(".anim-split-text");

	function setupSplits() {
		splitTexts.forEach((text) => {
			// Reset if needed
			if (text.anim) {
				text.anim.progress(1).kill();
				text.split.revert();
			}

			text.split = new SplitText(text, {
				type: "words,chars",
				linesClass: "split-line",
			});

			// Set up the anim
			text.anim = gsap.from(text.split.chars, {
				scrollTrigger: {
					trigger: text,
					toggleActions: "play pause resume reverse",
					start: "top 80%",
					end: "top 20%",
					scrub: true,
				},
				//duration: 0.6,
				ease: "circ.out",
				opacity: 0.15,
				stagger: 0.02,
			});
		});
	}

	ScrollTrigger.addEventListener("refresh", setupSplits);
	setupSplits();
}

/* flexccordion */
function flexccordion() {
	const tl = gsap.timeline();
	tl.set(".flexccordion_item-body", {
		height: 0,
		opacity: 0,
	});
	tl.set(".flexccordion_item .card", {
		opacity: 0,
	});

	/* show first item */
	tl.set(".flexccordion_item:nth-child(1) .flexccordion_item-body", {
		height: "auto",
		opacity: 1,
	});
	tl.set(".flexccordion_item:nth-child(1) .card", {
		opacity: 1,
	});

	// Click event listener for flexccordion headers
	document
		.querySelectorAll(".flexccordion_item-header")
		.forEach((header, index) => {
			header.addEventListener("click", () => {
				const tl_item = gsap.timeline();
				// get parent flexccordion
				const flexccordion = header.closest(".flexccordion");
				//Returns a selector function that's scoped to a particular Element, meaning it'll only find descendants of that Element like jQuery.find().
				let gsap_flexccordion = gsap.utils.selector(flexccordion);

				// Find the parent .flexccordion_item element
				const item = header.closest(".flexccordion_item");

				// Find the .flexccordion_item-body element within the parent item
				const body = item.querySelector(".flexccordion_item-body");

				// Find the .card element within the parent item
				const card = item.querySelector(".card");

				// Close all other items within this flexccordion
				tl_item.to(gsap_flexccordion(".flexccordion_item-body"), {
					height: 0,
					opacity: 0,
					duration: 0.35,
				});
				tl_item.to(
					gsap_flexccordion(".card"),
					{
						opacity: 0,
						duration: 0.1,
					},
					0.1
				);

				// Expand clicked item
				tl_item.to(
					body,
					{
						height: "auto",
						opacity: 1,
						duration: 0.35,
					},
					0.2
				);
				tl_item.to(
					card,
					{
						opacity: 1,
						duration: 0.35,
					},
					0.3
				);
			});
		});
}

function featuresTab() {
	/* set initial states */
	(function features_set() {
		const tl = gsap.timeline();
		/* hide all images and text */
		tl.set(".feature_body, .feature_img", {
			opacity: 0,
		});
		/* set all titles opacity */
		tl.set(".feature-title", {
			opacity: 0.5,
		});

		/* make first item active */
		tl.set(
			".features_item:nth-child(1) :is(.feature_bod, .feature_img, .feature-title",
			{
				opacity: 1,
			}
		);
	})();

	// event listener for feature titles
	document.querySelectorAll(".feature-title").forEach((title, index) => {
		// timeline for each item
		const tl_item = gsap.timeline({ paused: false });

		title.addEventListener("mouseover", () => {
			feature_mouseOver();
		});

		function feature_mouseOver() {
			// get parent features component
			const features = title.closest(".features");
			let gsap_features = gsap.utils.selector(features);

			// Find the parent .features_item element
			const item = title.closest(".features_item");
			let gsap_item = gsap.utils.selector(item);

			// Find the .feature_body element within the parent item
			const body = item.querySelector(".feature_body");

			// Find the img within the parent item
			const img = item.querySelector(".feature_img");

			// make other items inactive
			tl_item.to(
				gsap_features(".feature_body"),
				{
					opacity: 0,
					duration: 0.35,
				},
				0
			);
			tl_item.to(
				gsap_features(".feature_img"),
				{
					opacity: 0,
					duration: 0.75,
				},
				0
			);
			tl_item.to(
				gsap_features(".feature-title"),
				{
					opacity: 0.5,
					duration: 0.15,
				},
				0
			);

			// show item
			tl_item.to(
				title,
				{
					opacity: 1,
					duration: 0.85,
				},
				0.05
			);
			tl_item.to(
				body,
				{
					opacity: 1,
					duration: 0.3,
				},
				0.2
			);
			tl_item.to(
				img,
				{
					opacity: 1,
					duration: 0.85,
				},
				0.05
			);
		}
	});
}

function navHover() {
	// Get all subnav elements
	const subnavs = document.querySelectorAll(".subnav");

	// Loop through each subnav
	subnavs.forEach((subnav) => {
		// Get subnav links and images within the current subnav
		const subnavLinks = subnav.querySelectorAll(".subnav_link");
		const subnavImages = subnav.querySelectorAll(".subnav_img");

		// Hide all images except the first one
		gsap.set(subnavImages, { opacity: 0, display: "none" });
		gsap.set(subnavImages[0], { opacity: 1, display: "block" });

		// Add event listeners to each subnav link
		subnavLinks.forEach((link, index) => {
			link.addEventListener("mouseenter", () => {
				// Hide all images
				gsap.to(subnavImages, { opacity: 0, display: "none", duration: 0.3 });
				// Show the corresponding image
				gsap.to(subnavImages[index], {
					opacity: 1,
					display: "block",
					duration: 0.3,
				});
			});
		});
	});
}

function brandScroll() {
	const brands_loop = verticalLoop(".brands_list-item", {
		repeat: -1,
		paused: false,
		center: true,
		draggable: true, // I'm just being fancy
		inertia: true, // even fancier
		speed: 1,
	});

	/* Helper function from GSAP https://gsap.com/docs/v3/HelperFunctions/helpers/seamlessLoop */
	// use the helper function to build a seamless looping gsap.timeline() with some special properties/methods

	/*
This helper function makes a group of elements animate along the y-axis in a seamless, responsive loop.

Features:
- Uses yPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
- When each item animates up or down enough, it will loop back to the other side
- Optionally pass in a config object with values like draggable: true, center: true, speed (default: 1, which travels at roughly 100 pixels per second), paused (boolean), repeat, reversed, and paddingBottom.
- The returned timeline will have the following methods added to it:
    - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
    - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
    - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
    - current() - returns the current index (if an animation is in-progress, it reflects the final index)
    - times - an Array of the times on the timeline where each element hits the "starting" spot.
    - elements - an Array of the elements that are being controlled by the timeline
*/
	function verticalLoop(items, config) {
		items = gsap.utils.toArray(items);
		config = config || {};
		let onChange = config.onChange,
			lastIndex = 0,
			tl = gsap.timeline({
				repeat: config.repeat,
				onUpdate:
					onChange &&
					function () {
						let i = tl.closestIndex();
						if (lastIndex !== i) {
							lastIndex = i;
							onChange(items[i], i);
						}
					},
				paused: config.paused,
				defaults: { ease: "none" },
				onReverseComplete: () =>
					tl.totalTime(tl.rawTime() + tl.duration() * 100),
			}),
			length = items.length,
			startY = items[0].offsetTop,
			times = [],
			heights = [],
			spaceBefore = [],
			yPercents = [],
			curIndex = 0,
			center = config.center,
			clone = (obj) => {
				let result = {},
					p;
				for (p in obj) {
					result[p] = obj[p];
				}
				return result;
			},
			pixelsPerSecond = (config.speed || 1) * 100,
			snap =
				config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
			timeOffset = 0,
			container =
				center === true
					? items[0].parentNode
					: gsap.utils.toArray(center)[0] || items[0].parentNode,
			totalHeight,
			getTotalHeight = () =>
				items[length - 1].offsetTop +
				(yPercents[length - 1] / 100) * heights[length - 1] -
				startY +
				spaceBefore[0] +
				items[length - 1].offsetHeight *
					gsap.getProperty(items[length - 1], "scaleY") +
				(parseFloat(config.paddingBottom) || 0),
			populateHeights = () => {
				let b1 = container.getBoundingClientRect(),
					b2;
				items.forEach((el, i) => {
					heights[i] = parseFloat(gsap.getProperty(el, "height", "px"));
					yPercents[i] = snap(
						(parseFloat(gsap.getProperty(el, "y", "px")) / heights[i]) * 100 +
							gsap.getProperty(el, "yPercent")
					);
					b2 = el.getBoundingClientRect();
					spaceBefore[i] = b2.top - (i ? b1.bottom : b1.top);
					b1 = b2;
				});
				gsap.set(items, {
					// convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
					yPercent: (i) => yPercents[i],
				});
				totalHeight = getTotalHeight();
			},
			timeWrap,
			populateOffsets = () => {
				timeOffset = center
					? (tl.duration() * (container.offsetWidth / 2)) / totalHeight
					: 0;
				center &&
					times.forEach((t, i) => {
						times[i] = timeWrap(
							tl.labels["label" + i] +
								(tl.duration() * heights[i]) / 2 / totalHeight -
								timeOffset
						);
					});
			},
			getClosest = (values, value, wrap) => {
				let i = values.length,
					closest = 1e10,
					index = 0,
					d;
				while (i--) {
					d = Math.abs(values[i] - value);
					if (d > wrap / 2) {
						d = wrap - d;
					}
					if (d < closest) {
						closest = d;
						index = i;
					}
				}
				return index;
			},
			populateTimeline = () => {
				let i, item, curY, distanceToStart, distanceToLoop;
				tl.clear();
				for (i = 0; i < length; i++) {
					item = items[i];
					curY = (yPercents[i] / 100) * heights[i];
					distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
					distanceToLoop =
						distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");
					tl.to(
						item,
						{
							yPercent: snap(((curY - distanceToLoop) / heights[i]) * 100),
							duration: distanceToLoop / pixelsPerSecond,
						},
						0
					)
						.fromTo(
							item,
							{
								yPercent: snap(
									((curY - distanceToLoop + totalHeight) / heights[i]) * 100
								),
							},
							{
								yPercent: yPercents[i],
								duration:
									(curY - distanceToLoop + totalHeight - curY) /
									pixelsPerSecond,
								immediateRender: false,
							},
							distanceToLoop / pixelsPerSecond
						)
						.add("label" + i, distanceToStart / pixelsPerSecond);
					times[i] = distanceToStart / pixelsPerSecond;
				}
				timeWrap = gsap.utils.wrap(0, tl.duration());
			},
			refresh = (deep) => {
				let progress = tl.progress();
				tl.progress(0, true);
				populateHeights();
				deep && populateTimeline();
				populateOffsets();
				deep && tl.draggable
					? tl.time(times[curIndex], true)
					: tl.progress(progress, true);
			},
			proxy;
		gsap.set(items, { y: 0 });
		populateHeights();
		populateTimeline();
		populateOffsets();
		window.addEventListener("resize", () => refresh(true));
		function toIndex(index, vars) {
			vars = clone(vars);
			Math.abs(index - curIndex) > length / 2 &&
				(index += index > curIndex ? -length : length); // always go in the shortest direction
			let newIndex = gsap.utils.wrap(0, length, index),
				time = times[newIndex];
			if (time > tl.time() !== index > curIndex) {
				// if we're wrapping the timeline's playhead, make the proper adjustments
				time += tl.duration() * (index > curIndex ? 1 : -1);
			}
			if (vars.revolutions) {
				time += tl.duration() * Math.round(vars.revolutions);
				delete vars.revolutions;
			}
			if (time < 0 || time > tl.duration()) {
				vars.modifiers = { time: timeWrap };
			}
			curIndex = newIndex;
			vars.overwrite = true;
			gsap.killTweensOf(proxy);
			return tl.tweenTo(time, vars);
		}
		tl.elements = items;
		tl.next = (vars) => toIndex(curIndex + 1, vars);
		tl.previous = (vars) => toIndex(curIndex - 1, vars);
		tl.current = () => curIndex;
		tl.toIndex = (index, vars) => toIndex(index, vars);
		tl.closestIndex = (setCurrent) => {
			let index = getClosest(times, tl.time(), tl.duration());
			setCurrent && (curIndex = index);
			return index;
		};
		tl.times = times;
		tl.progress(1, true).progress(0, true); // pre-render for performance
		if (config.reversed) {
			tl.vars.onReverseComplete();
			tl.reverse();
		}
		if (config.draggable && typeof Draggable === "function") {
			proxy = document.createElement("div");
			let wrap = gsap.utils.wrap(0, 1),
				ratio,
				startProgress,
				draggable,
				dragSnap,
				align = () =>
					tl.progress(
						wrap(startProgress + (draggable.startY - draggable.y) * ratio)
					),
				syncIndex = () => tl.closestIndex(true);
			typeof InertiaPlugin === "undefined" &&
				console.warn(
					"InertiaPlugin required for momentum-based scrolling and snapping. https://greensock.com/club"
				);
			draggable = Draggable.create(proxy, {
				trigger: items[0].parentNode,
				type: "y",
				onPressInit() {
					gsap.killTweensOf(tl);
					startProgress = tl.progress();
					refresh();
					ratio = 1 / totalHeight;
					gsap.set(proxy, { y: startProgress / -ratio });
				},
				onDrag: align,
				onThrowUpdate: align,
				inertia: true,
				snap: (value) => {
					let time = -(value * ratio) * tl.duration(),
						wrappedTime = timeWrap(time),
						snapTime = times[getClosest(times, wrappedTime, tl.duration())],
						dif = snapTime - wrappedTime;
					Math.abs(dif) > tl.duration() / 2 &&
						(dif += dif < 0 ? tl.duration() : -tl.duration());
					return (time + dif) / tl.duration() / -ratio;
				},
				onRelease: syncIndex,
				onThrowComplete: syncIndex,
			})[0];
			tl.draggable = draggable;
		}
		tl.closestIndex(true);
		onChange && onChange(items[curIndex], curIndex);
		return tl;
	}
}

function collabs() {
	// TO DO - update to support multiple instances of this component on a page
	const collabsItems = gsap.utils.toArray(".collabs_item");
	const collabsList = document.querySelector(".collabs_list");
	const collabsListWrap = gsap.utils.toArray(".collabs_list-wrap");

	// get the items we want expanded when the list is split up (ie some aligned to left and some to right)
	const collabsItems_split = gsap.utils.toArray(
		".collabs_item:is(:nth-child(6n+1), :nth-child(6n+5))"
	);
	// get the items we want expanded when the list is neat (ie all aligned to the left)
	const collabsItems_neat = gsap.utils.toArray(".collabs_item:nth-child(3n+3)");

	function changeLayout() {
		// make all these items auto sized
		collabsItems_split.forEach((item) => {
			item.style.flexBasis = "auto";
			item.style.flexGrow = "0";
		});
		// make these items grow
		collabsItems_neat.forEach((item) => {
			item.style.flexBasis = "calc(50% - (2 * var(--collabs-gap)))";
			item.style.flexGrow = "1";
		});
	}

	function doFlip() {
		// get initial states of the list and all items (we need to record all of their initial posns and sizes because we're using position: absolute to animate)
		const state = Flip.getState(collabsItems, collabsList);

		// get initial height of list as some issues with this collapsing during animation
		const startingHeight = gsap.getProperty(collabsList, "height");

		// do the style change
		changeLayout();

		// get height after style change
		const newHeight = gsap.getProperty(collabsList, "height");

		// set height back to original height
		gsap.set(collabsList, { height: startingHeight });

		Flip.from(state, {
			absolute: true, // uses position: absolute during the flip to work around flexbox challenges
			duration: 1,
			stagger: 0.025, // slight stagger
		});
	}

	ScrollTrigger.create({
		trigger: ".collabs",
		start: "top center",
		onEnter: () => {
			doFlip();
		},
	});
}

/* testimonials */

/*

on load:
- get all case study items x
- set all img opacity 0
- set all body opacity 0
- set all caption opacity 0
- get first item 
	- set img, body, caption visible, 
	- set item to active

- get arrow elements
- get progress slider
- set slide index = 0

on arrow click
- change slide index
- set current active item inactive
- set next item active
- update progress bar


*/

function slider_caseStudies() {
	const caseStudies = {
		// tl: gsap.timeline(),
		component: document.querySelector(".case-studies"), // get the parent component element
		slides: [],
		currentSlideIndex: 0,
		nextSlideIndex: 0,
		previousSlideIndex: 0,
		nextButton: document.querySelector(".splide__arrow--next#case-study-next"),
		previousButton: document.querySelector(
			".splide__arrow--prev#case-study-prev"
		),
		loop: true,
		progressElement: document.querySelector(".slider-progress_bar#case-study"),
	};

	(function getSlides() {
		const slideElements = caseStudies.component.querySelectorAll(".case-study"); // get all slides

		slideElements.forEach((slideElement, index) => {
			const slideObj = {
				slide: slideElement,
				isActive: false,
				image: slideElement.querySelector(".case-study_img-wrap"), // get slide image
				body: slideElement.querySelector(".case-study_body"), // get slide body
				caption: slideElement.querySelector(".testimonial_caption"), // get slide caption
			};

			if (index === 0) {
				slideObj.isActive = true; // Set first slide as active
			} else {
				slideObj.image.style.opacity = 0;
				slideObj.body.style.opacity = 0;
				slideObj.caption.style.opacity = 0;
			}

			caseStudies.slides.push(slideObj); //add slides to caseStudies obj
		});
	})();

	(function openFirstSlide() {
		// if at least one slide, set first slide active
		if (caseStudies.slides.length != 0) {
			caseStudies.currentSlideIndex = 0;
			caseStudies.slides[0].isActive = true;
			updateIndexes(); // get prev and next indexes and pass to cS obj
			updateProgress(); // update progress bar
		}
	})();

	// update progress bar
	function updateProgress() {
		const percent =
			(caseStudies.currentSlideIndex / (caseStudies.slides.length - 1)) * 100;
		console.log(percent);
		if (caseStudies.progressElement) {
			gsap.to(caseStudies.progressElement, {
				width: `${percent}%`,
				duration: 0.5,
			});
		}
	}

	// get next and previous slides
	function getPreviousAndNextIndexes(totalSlides, currentIndex, shouldLoop) {
		if (currentIndex < 0 || currentIndex >= totalSlides) {
			throw new Error("Current slide index is out of range");
		}

		let previousIndex = currentIndex - 1;
		let nextIndex = currentIndex + 1;

		if (shouldLoop) {
			previousIndex = (previousIndex + totalSlides) % totalSlides;
			nextIndex = nextIndex % totalSlides;
		} else {
			previousIndex = Math.max(previousIndex, 0);
			nextIndex = Math.min(nextIndex, totalSlides - 1);
		}

		return {
			previousIndex: previousIndex,
			nextIndex: nextIndex,
		};
	}

	// update indexes
	function updateIndexes() {
		const indexes = getPreviousAndNextIndexes(
			caseStudies.slides.length,
			caseStudies.currentSlideIndex,
			caseStudies.loop
		);
		caseStudies.previousSlideIndex = indexes.previousIndex;
		caseStudies.nextSlideIndex = indexes.nextIndex;
	}

	// on next click
	caseStudies.nextButton.addEventListener("click", () => {
		openSlide(caseStudies.nextSlideIndex);
	});

	// on prev click
	caseStudies.previousButton.addEventListener("click", () => {
		openSlide(caseStudies.previousSlideIndex);
	});

	function openSlide(newIndex) {
		var oldIndex = caseStudies.currentSlideIndex;

		// set new slide to active
		caseStudies.currentSlideIndex = newIndex;
		caseStudies.slides[oldIndex].isActive = false;
		caseStudies.slides[newIndex].isActive = true;

		//update cS indexes
		updateIndexes();

		console.log(caseStudies.currentSlideIndex);

		const tl_slide = gsap.timeline();
		const gsap_component = gsap.utils.selector(caseStudies.component);
		const gsap_slide = gsap.utils.selector(
			caseStudies.slides[caseStudies.currentSlideIndex].slide
		);
		tl_slide.to(
			gsap_component(
				".case-study_img-wrap, .case-study_body, .testimonial_caption"
			),
			{
				opacity: 0,
				duration: 0.35,
			}
		);
		tl_slide.to(
			gsap_slide(
				".case-study_img-wrap, .case-study_body, .testimonial_caption"
			),
			{
				opacity: 1,
				duration: 0.35,
			}
		);

		updateProgress();
	}
}

function accordion() {
	let panels = gsap.utils.toArray(".accordion-panel");
	let headers = gsap.utils.toArray(".accordion_header");
	let animations = panels.map(createAnimation); //create an animation function for every panel

	headers.forEach((header) => {
		header.addEventListener("click", () => playAnim(header));
	});

	function playAnim(selectedHeader) {
		animations.forEach((animation) => animation(selectedHeader));
	}

	function createAnimation(element) {
		let header = element.querySelector(".accordion_header");
		let body = element.querySelector(".accordion_body-wrap");
		let icon = element.querySelector(".accordion_icon");
		let iconInner = element.querySelector(".accordion_icon-inner");

		gsap.set(body, { height: "auto" });
		gsap.set(icon, { opacity: 1 });
		gsap.set(iconInner, {
			rotationZ: 45,
			transformOrigin: "50% 50%",
		});

		let animation = gsap
			.timeline()
			.from(body, {
				height: 0,
				duration: 0.75,
				ease: "power1.inOut",
			})
			.from(icon, { duration: 0.2, opacity: 0.4, ease: "none" }, 0)
			.from(iconInner, { duration: 0.2, rotationZ: 0, ease: "none" }, 0)
			.reverse();

		return function (selected) {
			if (selected === header) {
				animation.reversed(!animation.reversed());
			} else {
				animation.reverse();
			}
		};
	}
}

// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
	// wait until window is loaded - all images, styles-sheets, fonts, links, and other media assets
	// you could also use addEventListener() instead
	window.onload = function () {
		// OPTIONAL - waits til next tick render to run code (prevents running in the middle of render tick)
		window.requestAnimationFrame(function () {
			// GSAP custom code goes here
			stickyHomeHero();
			splitText();
			try {
				brandScroll();
			} catch (err) {
				console.log("no brand scroll");
			}
			flexccordion();
			featuresTab();
			collabs();
			accordion();
			navHover();
			slider_caseStudies();
		});
	};
});
