document.addEventListener("DOMContentLoaded", function () {
	// ヘアアレンジスライダー: 768px以下のみswiper有効、769px以上はdestroy
	let hairarrangeSwiper01 = null;
	let hairarrangeSwiper02 = null;

	function initOrDestroyHairarrangeSwipers() {
		const isMobile = window.matchMedia("(max-width: 768px)").matches;

		// 1つめ
		const el1 = document.querySelector(".js-top__hairarrange-slider01");
		if (el1) {
			if (isMobile) {
				if (!hairarrangeSwiper01 || hairarrangeSwiper01.destroyed) {
					hairarrangeSwiper01 = new Swiper(el1, {
						slidesPerView: 1,
						spaceBetween: 40,
						loop: true,
						navigation: {
							nextEl: ".js-top__hairarrange-3col-slider-next01",
							prevEl: ".js-top__hairarrange-3col-slider-prev01",
						},
					});
					el1.classList.remove("swiper-destroy");
				}
			} else {
				if (hairarrangeSwiper01 && !hairarrangeSwiper01.destroyed) {
					hairarrangeSwiper01.destroy(true, true);
					el1.classList.add("swiper-destroy");
				}
			}
		}

		// 2つめ
		const el2 = document.querySelector(".js-top__hairarrange-slider02");
		if (el2) {
			if (isMobile) {
				if (!hairarrangeSwiper02 || hairarrangeSwiper02.destroyed) {
					hairarrangeSwiper02 = new Swiper(el2, {
						slidesPerView: 1,
						spaceBetween: 40,
						loop: true,
						navigation: {
							nextEl: ".js-top__hairarrange-3col-slider-next02",
							prevEl: ".js-top__hairarrange-3col-slider-prev02",
						},
					});
					el2.classList.remove("swiper-destroy");
				}
			} else {
				if (hairarrangeSwiper02 && !hairarrangeSwiper02.destroyed) {
					hairarrangeSwiper02.destroy(true, true);
					el2.classList.add("swiper-destroy");
				}
			}
		}
	}

	// 初期化 (DOMContentLoadedの中なので即実行)
	initOrDestroyHairarrangeSwipers();

	// matchMediaのchangeイベントで監視（resizeのパフォーマンス問題回避）
	const mq = window.matchMedia("(max-width: 768px)");
	mq.addEventListener
		? mq.addEventListener("change", initOrDestroyHairarrangeSwipers)
		: mq.addListener(initOrDestroyHairarrangeSwipers); // for IE11/Fallback

	// .special photoのスライダー
	const photoSlider = document.querySelector(".js-photo-slider");
	let photoSwiper = null;
	if (photoSlider) {
		photoSwiper = new Swiper(".js-photo-slider", {
			loop: true,
			slidesPerView: "auto",
			spaceBetween: 32,
			autoplay: false,
			// autoplay: {
			// 	delay: 1500,
			// },
			breakpoints: {
				769: {
					centeredSlides: true,
					spaceBetween: 38,
				},
			},
		});

		photoSlider.addEventListener("click", function (e) {
			let target = e.target;

			if (photoSwiper && photoSwiper.autoplay) {
				photoSwiper.autoplay.stop();
			}

			popImage(target);

			// while (target && target !== photoSlider && !target.classList.contains("js-top__photo-slider-item")) {
			// 	target = target.parentElement;
			// }
			// if (target && target.classList && target.classList.contains("js-top__photo-slider-item")) {
			// 	if (target.classList.contains("clicked")) {
			// 		// すでにclickedがついていたら除去してautoplay再開
			// 		target.classList.remove("clicked");
			// 		if (photoSwiper && photoSwiper.autoplay) {
			// 			photoSwiper.autoplay.start();
			// 		}
			// 	} else {
			// 		// clickedクラス付与してautoplay停止
			// 		photoSlider
			// 			.querySelectorAll(".js-top__photo-slider-item.clicked")
			// 			.forEach((el) => el.classList.remove("clicked"));
			// 		target.classList.add("clicked");
			// 		if (photoSwiper && photoSwiper.autoplay) {
			// 			photoSwiper.autoplay.stop();
			// 		}
			// 	}
			// }
		});
	}

	// タブ切り替え用JS
	const tabs = document.querySelectorAll(".js-tab-nav-item");
	const panels = document.querySelectorAll(".js-tab-panel");
	tabs.forEach((tab) => {
		tab.addEventListener("click", function () {
			tabs.forEach((t) => t.classList.remove("active"));
			panels.forEach((panel) => panel.classList.remove("active"));
			this.classList.add("active");
			const activePanel = document.getElementById(this.dataset.tab);
			if (activePanel) activePanel.classList.add("active");
		});
	});

	// アコーディオン（.js-accordion-btn用）
	const accordionBtns = document.querySelectorAll(".js-accordion-btn");
	accordionBtns.forEach((btn) => {
		btn.addEventListener("click", function () {
			this.classList.toggle("open");
			const content = this.nextElementSibling;
			if (!content) return;

			// display: noneの場合は開くときにblockにする
			if (!content.style.display || content.style.display === "none") {
				content.style.display = "block";
			}

			if (content.style.maxHeight) {
				// 展開中→閉じる
				content.style.maxHeight = null;
				content.addEventListener("transitionend", function handler() {
					content.style.display = "none";
					content.removeEventListener("transitionend", handler);
				});
			} else {
				// 閉じている→開く
				content.style.display = "block"; // まず表示
				// 一度maxHeightをautoにして正しい高さを取得
				content.style.maxHeight = "none";
				let fullHeight = content.scrollHeight + "px";
				content.style.maxHeight = "0";
				// 少し遅延してからmaxHeightを設定してスライド
				setTimeout(() => {
					content.style.maxHeight = fullHeight;
				}, 10);
			}
			content.style.overflow = "hidden";
		});

		// 初期状態で .open が付いていた場合
		if (btn.classList.contains("open")) {
			const content = btn.nextElementSibling;
			if (content) {
				content.style.display = "block";
				content.style.maxHeight = content.scrollHeight + "px";
				content.style.overflow = "hidden";
			}
		} else {
			// 初期状態で閉じている場合は非表示
			const content = btn.nextElementSibling;
			if (content) {
				content.style.display = "none";
				content.style.maxHeight = null;
				content.style.overflow = "hidden";
			}
		}
	});

	// セッションストレージの"load"を確認
	const loadingAnimation = document.querySelector(".js-loading-animation");
	if (loadingAnimation) {
		if (sessionStorage.getItem("load") === "true") {
			document.querySelector(".js-loading-animation").classList.remove("is-not-loaded");
		} else {
			document.querySelectorAll(".js-mv-catch-txt-wrap.is-loaded").forEach(function (el) {
				el.classList.remove("is-loaded");
			});

			// .js-loading-animationと.js-loading-movieに.is-not-loadedを付与
			var loadingMovie = document.querySelector(".js-loading-movie");
			loadingAnimation.classList.add("is-not-loaded");
			if (loadingMovie) {
				loadingMovie.classList.add("is-not-loaded");
				// .js-loading-movie内の<video>を取得して再生
				var video = loadingMovie.querySelector("video");
				if (video) {
					// 動画を最初から再生する（念のため）
					video.currentTime = 0;
					var playPromise = video.play(); // 一部ブラウザ(自動再生)対応
					if (playPromise !== undefined) {
						playPromise.catch(function () {});
					}

					// 動画再生完了時
					video.addEventListener("ended", function () {
						// .js-loading-movieに.is-playedを付与
						loadingMovie.classList.add("is-played");
						loadingAnimation.classList.add("is-loaded");

						// 0.5秒後、.js-mv-catch-txt-wrapすべてに.is-showを付与する
						// ひとつの要素に付与したら0.3秒間を空ける
						setTimeout(function () {
							var catchTxtWraps = document.querySelectorAll(".js-mv-catch-txt-wrap");
							catchTxtWraps = Array.prototype.slice.call(catchTxtWraps); // NodeList to Array
							catchTxtWraps.forEach(function (el, i) {
								setTimeout(function () {
									el.classList.add("is-show");
								}, i * 300);
							});
						}, 500);

						// セッションストレージloadをtrueに
						sessionStorage.setItem("load", "true");
					});
				} else {
					// 動画タグが存在しない場合も即ロード完了扱い
					loadingMovie.classList.add("is-played");
					setTimeout(function () {
						loadingAnimation.classList.add("is-loaded");
						sessionStorage.setItem("load", "true");
					}, 500);
				}
			}
		}
	}

	// 動画
	const movieVideo = document.querySelector("#js-movie-video");
	const moviePlayBtn = document.querySelector(".js-movie-video-play-btn");

	if (movieVideo && moviePlayBtn) {
		movieVideo.addEventListener("click", function () {
			if (movieVideo.paused) {
				movieVideo.play();
			} else {
				movieVideo.pause();
			}
		});
		movieVideo.addEventListener("play", function () {
			moviePlayBtn.classList.add("play");
		});
		movieVideo.addEventListener("pause", function () {
			moviePlayBtn.classList.remove("play");
		});
		movieVideo.addEventListener("ended", function () {
			moviePlayBtn.classList.remove("play");
		});
	}

	// ハンバーガー
	const hamburger = document.querySelector(".js-nav-hamburger");
	const logo = document.querySelector(".p-header__logo");
	const nav = document.querySelector(".p-header__nav");

	if (hamburger && logo && nav) {
		hamburger.addEventListener("click", function () {
			hamburger.classList.toggle("is-open");
			logo.classList.toggle("is-open");
			nav.classList.toggle("is-open");
		});
	}

	// 768px以下で.nav-linkクリック時にハンバーガーメニューを閉じる
	const navLinks = document.querySelectorAll(".js-nav-link");
	navLinks.forEach(function (link) {
		link.addEventListener("click", function () {
			if (window.innerWidth <= 768) {
				if (hamburger) hamburger.classList.remove("is-open");
				if (logo) logo.classList.remove("is-open");
				if (nav) nav.classList.remove("is-open");
			}
		});
	});
});

// js-scroll-animationが画面に100px入ったらis-showをつける
(function () {
	var scrollAnims = Array.prototype.slice.call(document.querySelectorAll(".js-scroll-animation"));
	if (scrollAnims.length === 0) return;

	var ticking = false;

	function onScroll() {
		if (!ticking) {
			window.requestAnimationFrame(function () {
				checkScrollAnimations();
				ticking = false;
			});
			ticking = true;
		}
	}

	function checkScrollAnimations() {
		var windowHeight = window.innerHeight || document.documentElement.clientHeight;
		scrollAnims.forEach(function (el) {
			if (el.classList.contains("is-show")) return; // 一度付与したら何もしない

			var rect = el.getBoundingClientRect();
			var elHeight = rect.height;
			var visibleTop = Math.max(rect.top, 0);
			var visibleBottom = Math.min(rect.bottom, windowHeight);
			var visibleHeight = Math.max(0, visibleBottom - visibleTop);

			// 100px以上見えていたら判定
			if (visibleHeight >= 100) {
				el.classList.add("is-show");
			}
		});
	}

	// 初期チェック
	window.addEventListener("load", checkScrollAnimations);
	window.addEventListener("resize", onScroll, { passive: true });
	window.addEventListener("scroll", onScroll, { passive: true });
})();

// ニュースのアコーディオン
(function () {
	var newsItems = document.querySelectorAll(".p-top__news-item");
	var moreBtn = document.querySelector(".js-news-more-btn");
	if (!newsItems.length || !moreBtn) return;

	// 4つ目以降をdivでまとめてラップ
	var wrap;
	if (newsItems.length > 3) {
		wrap = document.createElement("div");
		wrap.className = "js-news-slide-group";
		// newsItems[3]以降をwrap内に移動
		for (var i = 3; i < newsItems.length; i++) {
			wrap.appendChild(newsItems[i]);
		}
		// wrapをリストの末尾に追加
		var parent = newsItems[2].parentNode;
		parent.appendChild(wrap);

		// 初期状態: wrapを非表示（スライドアップ）
		wrap.style.display = "none";
		wrap.style.overflow = "hidden";
		wrap.style.maxHeight = "0px";
		wrap.style.transition = "max-height 0.4s ease";
	} else {
		const newsMore = document.querySelector(".p-top__news-more");
		if (newsMore && newsMore.parentNode) {
			newsMore.parentNode.removeChild(newsMore);
		}
	}

	// スライドトグル関数（まとめて1かたまり用）
	function slideToggleGroup(el) {
		if (!el) return;
		if (el.style.display === "none" || el.style.maxHeight === "0px") {
			// ---スライドダウン---
			el.style.display = "block";
			el.style.overflow = "hidden";
			// 1. 一旦maxHeight: 0px、トリガーを確実に
			el.style.transition = "none";
			el.style.maxHeight = "0px";
			// 2. reflowを強制
			void el.offsetHeight;
			// 3. 目標maxHeightをセット、トランジション有効化
			var height = el.scrollHeight + "px";
			el.style.transition = "max-height 0.4s ease";
			el.style.maxHeight = height;

			// 最後までスムーズにするため、完了後にmaxHeightをauto、overflow:visible
			setTimeout(function () {
				el.style.transition = "";
				el.style.maxHeight = "none";
				el.style.overflow = "";
			}, 400);
		} else {
			// ---スライドアップ---
			el.style.transition = "max-height 0.4s ease";
			el.style.overflow = "hidden";
			// maxHeightを現在の高さにセット（必要に応じて計算）
			el.style.maxHeight = el.scrollHeight + "px";
			// 強制reflow
			void el.offsetHeight;
			// maxHeightを0に
			el.style.maxHeight = "0px";
			setTimeout(function () {
				el.style.display = "none";
				el.style.transition = "";
				el.style.maxHeight = "0px";
				el.style.overflow = "";
			}, 400);
		}
	}

	// 状態チェック用関数
	function isNewsOpen() {
		// 開いてる＝display:blockかつmaxHeight: 'none' or ''
		return (
			wrap && wrap.style.display !== "none" && (wrap.style.maxHeight === "none" || wrap.style.maxHeight === "")
		);
	}

	moreBtn.addEventListener("click", function () {
		slideToggleGroup(wrap);
		// テキストを変更
		setTimeout(function () {
			if (isNewsOpen()) {
				moreBtn.classList.add("open");
			} else {
				moreBtn.classList.remove("open");
			}
		}, 410); // スライドアニメ後
	});
})();

// ヘッダーのスクロールによってis-hideをつけたり外したりする
(function () {
	var lastScrollY = window.scrollY || window.pageYOffset;
	var ticking = false;
	var header = document.querySelector(".p-header");

	function onScroll() {
		if (!ticking) {
			window.requestAnimationFrame(function () {
				handleHeaderScroll();
				ticking = false;
			});
			ticking = true;
		}
	}

	function handleHeaderScroll() {
		var currentScrollY = window.scrollY || window.pageYOffset;
		if (!header) return;
		if (currentScrollY > lastScrollY && currentScrollY > 30) {
			// 下方向
			header.classList.add("is-hide");
		} else {
			// 上方向
			header.classList.remove("is-hide");
		}
		lastScrollY = currentScrollY;
	}

	window.addEventListener("scroll", onScroll, { passive: true });
})();

// 波のアニメーション
(function () {
	// セレクタ
	var waveEls = document.querySelectorAll(".js-wave");
	if (!waveEls.length) return; // 要素がなければ終了

	var waveConfigs = []; // { wavePath, phase, speed, duration }

	waveEls.forEach(function (waveEl, idx) {
		var waveSvg = waveEl.querySelector(":scope .js-wave-clip-svg");
		if (!waveSvg) return;
		var wavePath = waveSvg.querySelector(":scope .js-wave-clip-path-path");
		if (!wavePath) return;
		// 各waveの動きをずらすため、開始段階で異なるphase(offset)を与える
		var phaseOffset = (idx / waveEls.length) * Math.PI * 2;

		// speedは0.018～0.042ぐらいでランダムに
		var speed = 0.008 + Math.random() * 0.014;
		waveConfigs.push({
			wavePath: wavePath,
			phase: phaseOffset,
			speed: speed,
			duration: Math.random() * Math.PI * 2, // 時間進行もずらす
		});
	});

	if (!waveConfigs.length) return;
	var waveBaseY = 30,
		waveAmp = 20;
	var numPoints = 20; // よりなめらかな曲線にするため分割数を増やす
	var waveWidth = 1200;

	function getWavePoints(t, phase) {
		// (1200pxをnumPoints等間隔で分割，各点のy座標をsinで生成)
		var points = [];
		for (var i = 0; i < numPoints; i++) {
			var x = (waveWidth / (numPoints - 1)) * i;
			// サイン波の進行をphaseでずらす
			var y = waveBaseY + Math.sin(t + phase + (i * Math.PI * 2) / (numPoints - 1)) * waveAmp;
			points.push({ x: x, y: y });
		}
		return points;
	}

	function pointsToPath(points) {
		// S字状（滑らかな波/S字カーブになるような）Catmull-RomスプラインをCubic bezierに変換
		function getCtrlPoint(p0, p1, p2, t = 0.5) {
			// p0, p1, p2 : 前,現在,次の点 / t:張り具合
			return {
				x: p1.x + ((p2.x - p0.x) * t) / 6,
				y: p1.y + ((p2.y - p0.y) * t) / 6,
			};
		}

		var d = `M${points[0].x},${points[0].y}`;

		for (var i = 0; i < points.length - 1; i++) {
			var p0 = points[i === 0 ? 0 : i - 1];
			var p1 = points[i];
			var p2 = points[i + 1];
			var p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2];

			// p1-p2区間のコントロールポイント
			var cp1 = getCtrlPoint(p0, p1, p2);
			var cp2 = getCtrlPoint(p3, p2, p1);

			d += ` C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
		}
		// 下辺・右側・左側を閉じる
		d += ` V60 H0 Z`;
		return d;
	}

	// 各要素ごとに異なる速度や開始タイミングにする
	function animateWave() {
		waveConfigs.forEach(function (config) {
			config.duration += config.speed;
			var points = getWavePoints(config.duration, config.phase);
			var d = pointsToPath(points);
			config.wavePath.setAttribute("d", d.replace(/\s+/g, " ").trim());
		});
		requestAnimationFrame(animateWave);
	}
	animateWave();
})();

// ヘアアレンジモーダル
document.querySelectorAll(".js-top__hairarrange-arrange-cnt-img-button").forEach((button) => {
	button.addEventListener("click", function (e) {
		e.preventDefault();
		const dialog = button.nextElementSibling;
		if (dialog && dialog.tagName.toLowerCase() === "dialog") {
			dialog.showModal();
			dialog.classList.add("open");
			setTimeout(() => {
				const video = dialog.querySelector("video");
				if (video) {
					video.currentTime = 0;
					video.play();
				}
			}, 300);
		}
	});
});

document.querySelectorAll(".js-top__hairarrange-modal").forEach((dialog) => {
	// 閉じるボタン
	const closeBtn = dialog.querySelector(".js-top-hairarrange-modal-close");
	if (closeBtn) {
		closeBtn.addEventListener("click", function (e) {
			e.preventDefault();
			dialog.classList.remove("open");
			setTimeout(() => {
				dialog.close();
				const video = dialog.querySelector("video");
				if (video) {
					video.pause();
				}
			}, 300);
		});
	}
	// backdrop
	dialog.addEventListener("click", function (e) {
		// If click was directly on the dialog itself (not a child)
		if (e.target === dialog) {
			dialog.classList.remove("open");
			setTimeout(() => {
				dialog.close();
				const video = dialog.querySelector("video");
				if (video) {
					video.pause();
				}
			}, 300);
		}
	});
});

// Special Movieのyoutube動画(iframe)をスクロールで再生
let userPausedYouTube = false;
let ytPlayerInstance = null;

window.addEventListener(
	"DOMContentLoaded",
	function () {
		youtubeIframe = document.getElementById("youtube_player");
		if (youtubeIframe) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			const firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		}
	},
	false,
);

function onYouTubeIframeAPIReady() {
	ytPlayerInstance = new YT.Player("youtube_player", {
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
}

function onPlayerReady(event) {
	switchVideo(event.target);

	let ticking = false;
	window.addEventListener(
		"scroll",
		function () {
			if (!ticking) {
				window.requestAnimationFrame(function () {
					switchVideo(event.target);
					ticking = false;
				});
				ticking = true;
			}
		},
		false,
	);
}

// Detect manual pause by the user on the YouTube player
function onPlayerStateChange(event) {
	// 2 = YT.PlayerState.PAUSED
	// 1 = YT.PlayerState.PLAYING
	if (event.data === 2) {
		if (!pausedByScroll) {
			userPausedYouTube = true;
		}
	} else if (event.data === 1) {
		// Reset flag if user plays (maybe by UI)
		userPausedYouTube = false;
	}
}

let pausedByScroll = false;

function switchVideo(targetPlayer) {
	const playerPosition = targetPlayer.getIframe().getBoundingClientRect().top + window.pageYOffset;
	const startPosition = window.pageYOffset + window.innerHeight;
	const endPosition = window.pageYOffset;
	if (playerPosition < startPosition && playerPosition > endPosition) {
		if (!userPausedYouTube) {
			pausedByScroll = false;
			targetPlayer.mute();
			targetPlayer.playVideo();
		}
	} else {
		if (ytPlayerInstance && ytPlayerInstance.getPlayerState && ytPlayerInstance.getPlayerState() === 1) {
			// 1 = PLAYING
			pausedByScroll = true;
			targetPlayer.pauseVideo();
		}
	}
}
