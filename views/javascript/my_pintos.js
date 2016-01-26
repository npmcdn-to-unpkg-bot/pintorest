$(document).ready(function () {
	(function () {
		var $grid = $(".grid").masonry({
			itemSelector: ".grid-item",
			columnWidth: ".grid-item"
		});

		$grid.imagesLoaded().progress(function () {
			$grid.masonry("layout");
		});

		function removePinto() {
			
			$("#delete-confirm").modal("show");
			var $this = $(this);
			var title = $(this).parents(".wrapper").find("h4").text();
			var id = $(this).parents(".grid-item").attr("data-id");
			$("#delete-confirm h3").text("Are you sure you want to delete " + title + "?");

			$(".confirm-removal").on("click", function () {
				$.ajax({
					url: "/api/pintos",
					method: "DELETE",
					data: {id: id},
					success: function (res) {
						$("#delete-confirm").modal("hide");
						$this.closest(".grid-item").remove();
						$grid.masonry("reloadItems").masonry("layout");
					}
				});
			});
		}

		// broken image detector
		function brokenImg() {
			$("img").one("error", function () {
				this.src = "images/default.jpg";
				$grid.masonry("layout"); // reload grid
			});
		}


		document.getElementsByTagName("form")[0].addEventListener("submit", function (e) {
			e.preventDefault();

			var url = document.getElementById("pinto-url").value;
			var title = document.getElementById("pinto-title").value;
			var html = "";


			$.post("/api/pintos", { pintoTitle: title, pintoUrl: url }, function (data) {
				var id = data[0]._id;
				var template = _.template(
					"<div class='grid-item col-md-4 col-lg-2' data-id='<%= id %>'>" +
						"<img src='<%= url %>'>" +
						"<div class='wrapper'>" +
							"<h4><%= title %></h4>" + 
							"<div class='poster-div'>" +
								"<span class='remove-pinto'>remove</span>" +
							"</div>" +
							"<div class='likes-div'>" +
								"<span>0 <i class='glyphicon glyphicon-chevron-up'></i></span>&nbsp;" +
								"<span>0 <i class='fa fa-repeat'></i></span>" +
							"</div>" +
						"</div>" +
					"</div>"
				)({ url: url, title: title, id: id });

				$("#myModal").modal("hide");
				$grid.append(template).masonry("reloadItems").masonry("layout");
				
				$(".remove-pinto").on("click", removePinto);
				brokenImg();

				document.getElementById("pinto-url").value = "";
				document.getElementById("pinto-title").value = "";
			});
		});

		$(".remove-pinto").on("click", removePinto);

		brokenImg();
	})();
});