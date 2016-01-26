$(document).ready(function () {
	(function () {
		
		// like or unline a pinto
		function likeOrUnlike() {
			var id = $(this).parents(".grid-item").attr("data-id");
			var $that = $(this);

			if ($(this).hasClass("not-liked")) {
				$.ajax({
					url: "/api/pintos/" + id,
					method: "PUT",
					data: { method: "add-like" },
					success: function (result) {
						$that.removeClass("not-liked").addClass("liked");
						$that.prev(".likes-amount").text(+$that.prev(".likes-amount").text() + 1);
					}
				});
			} 

			else {
				$.ajax({
					url: "/api/pintos/" + id,
					method: "PUT",
					data: { method: "unlike" },
					success: function (result) {
						$that.removeClass("liked").addClass("not-liked");
						$that.prev(".likes-amount").text(+$that.prev(".likes-amount").text() - 1);
					}
				});
			}
		}

		$(".likes").on("click", likeOrUnlike);
		
	})();
});