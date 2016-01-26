$(document).ready(function () {
	(function () {
			
		// repost or remove a repost
		function repostOrRemove() {
			var id = $(this).parents(".grid-item").attr("data-id");
			var $that = $(this);

			if ($(this).hasClass("not-reposted")) {
				$.ajax({
					url: "/api/pintos/" + id,
					method: "PUT",
					data: { method: "add-repost" },
					success: function (result) {
						$that.removeClass("not-reposted").addClass("reposted");
						$that.prev(".reposts-amount").text(+$that.prev(".reposts-amount").text() + 1 + " ");
					}
				});
			} 

			else {
				$.ajax({
					url: "/api/pintos/" + id,
					method: "PUT",
					data: { method: "remove-repost" },
					success: function (result) {
						$that.removeClass("reposted").addClass("not-reposted");
						$that.prev(".reposts-amount").text(+$that.prev(".reposts-amount").text() - 1 + " ");
					}
				});
			}
		}

		$(".reposts").on("click", repostOrRemove);
		
	})();
});