$(document).ready(function () {
	(function () {

		var $grid = $(".grid").masonry({
			itemSelector: ".grid-item",
			columnWidth: ".grid-item"
		});

		$grid.imagesLoaded().progress(function () {
			$grid.masonry("layout");
		});

		// broken image detector
		function brokenImg() {
			$("img").one("error", function () {
				this.src = "images/default.jpg";
				$grid.masonry("layout"); // reload grid
			});
		}

		brokenImg();

	})();
});