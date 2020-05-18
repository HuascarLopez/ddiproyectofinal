// Acordion class handler
$(".accordion").on("click", "header", function() {
  if (
    $(this)
      .parent()
      .hasClass("hidden")
  ) {
    $(this)
      .parent()
      .removeClass("hidden")
      .siblings()
      .addClass("hidden");
  } else {
    $("section").addClass("hidden");
  }
});
