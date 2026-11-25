/**
 * Desenvolvimento: Foco Publicidade Comunicação Digital
 * Versão: 1.0
 * Data: 04/08/2026
 * Projeto: Porto Mais — Scripts principais
 */
(function ($) {
  "use strict";

  /**
   * Frota por grupo.
   * Troque os caminhos em `images` pelos PNGs sem fundo de cada modelo.
   * Pastas sugeridas: assets/img/frota/grupo-a|b|c|c-plus|d|e/
   */
  var fleetVehicles = [
    {
      name: "Grupo B Compacto",
      subtitle: "Argo, Polo, HB20 1.0 ou similar",
      images: [
        "assets/img/frota/grupo-b/argo.png",
        "assets/img/frota/grupo-b/polo.png",
        "assets/img/frota/grupo-b/hb20.png"
      ],
      transmission: "Manual",
      people: "5 pessoas",
      bags: "2 malas"
    },
    {
      name: "Grupo C Sedan",
      subtitle: "Cronos, HB20S 1.0 ou similar",
      images: [
        "assets/img/frota/grupo-c/cronos.png",
        "assets/img/frota/grupo-c/hb20s.png"
      ],
      transmission: "Manual",
      people: "5 pessoas",
      bags: "3 malas"
    },
    {
      name: "Grupo C+ Sedan",
      subtitle: "Cronos 1.3 Automático ou similar",
      images: [
        "assets/img/frota/grupo-c-plus/cronos-13-automatico.png"
      ],
      transmission: "Automático",
      people: "5 pessoas",
      bags: "3 malas"
    },
    {
      name: "Grupo D SUV",
      subtitle: "Tracker, Renegade ou similar",
      images: [
        "assets/img/frota/grupo-d/tracker.png",
        "assets/img/frota/grupo-d/renegade.png"
      ],
      transmission: "Automático",
      people: "5 pessoas",
      bags: "3 malas"
    },
    {
      name: "Grupo E Minivan",
      subtitle: "Spin 1.8 Automático 7 lugares",
      images: [
        "assets/img/frota/grupo-e/spin.png"
      ],
      transmission: "Automático",
      people: "7 pessoas",
      bags: "4 malas"
    },
    {
      name: "Grupo A",
      subtitle: "Moto Bros 160",
      images: [
        "assets/img/frota/grupo-a/bros-160.png"
      ],
      transmission: "Manual",
      people: "2 pessoas",
      bags: "0 malas"
    }
  ];

  var fleetMobileMq = window.matchMedia("(max-width: 767.98px)");

  function fleetImagesHtml(vehicle) {
    return vehicle.images
      .map(function (src, index) {
        var alt = vehicle.name + (vehicle.subtitle ? " — " + vehicle.subtitle : "");
        return (
          '<div class="fleet-card__slide">' +
            '<img src="' + src + '" alt="' + alt + '" loading="' + (index === 0 ? "eager" : "lazy") + '">' +
          "</div>"
        );
      })
      .join("");
  }

  function fleetCardTemplate(vehicle) {
    var peopleLabel = String(vehicle.people).replace(/\D/g, "") || vehicle.people;
    var bagsLabel = String(vehicle.bags).replace(/\D/g, "") || vehicle.bags;
    var subtitleHtml = vehicle.subtitle
      ? '<p class="fleet-card__subtitle">' + vehicle.subtitle + "</p>"
      : "";
    var whatsappText = encodeURIComponent(
      "Olá! Tenho interesse no " +
        vehicle.name +
        (vehicle.subtitle ? " (" + vehicle.subtitle + ")" : "") +
        "."
    );

    return (
      '<div class="fleet-card-col">' +
        '<article class="fleet-card">' +
          '<div class="fleet-card__image">' +
            '<div class="fleet-card__slider">' +
              fleetImagesHtml(vehicle) +
            "</div>" +
          "</div>" +
          '<h3 class="fleet-card__name">' + vehicle.name + "</h3>" +
          subtitleHtml +
          '<ul class="fleet-card__specs">' +
            "<li><i class=\"bi bi-person\"></i><span>" + peopleLabel + "</span></li>" +
            "<li><i class=\"bi bi-briefcase\"></i><span>" + bagsLabel + "</span></li>" +
            "<li><i class=\"bi bi-gear\"></i><span>" + vehicle.transmission + "</span></li>" +
          "</ul>" +
          '<div class="fleet-card__actions">' +
            '<a class="fleet-card__btn fleet-card__btn--whatsapp" href="https://wa.me/5573999854767?text=' +
              whatsappText +
              '" target="_blank" rel="noopener noreferrer">' +
              '<i class="bi bi-whatsapp"></i> WhatsApp' +
            "</a>" +
            '<button type="button" class="fleet-card__btn fleet-card__btn--budget" data-budget-open data-categoria="' +
              String(vehicle.name).replace(/"/g, "&quot;") +
              '" data-categoria-label="' +
              String(vehicle.name + (vehicle.subtitle ? " — " + vehicle.subtitle : "")).replace(/"/g, "&quot;") +
              '">' +
              '<i class="bi bi-calculator"></i> Orçamento' +
            "</button>" +
          "</div>" +
        "</article>" +
      "</div>"
    );
  }

  function initFleetImageSliders($scope) {
    $scope.find(".fleet-card__slider").each(function () {
      var $slider = $(this);

      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("setPosition");
        return;
      }

      var total = $slider.children(".fleet-card__slide").length;

      if (!total) {
        return;
      }

      $slider.slick({
        dots: total > 1,
        arrows: false,
        infinite: true,
        speed: 450,
        fade: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        autoplay: total > 1,
        autoplaySpeed: 2800,
        pauseOnHover: true,
        pauseOnFocus: true
      });
    });
  }

  function renderAllFleetCards() {
    var $grid = $("#fleetGrid");
    var html = fleetVehicles.map(fleetCardTemplate).join("");
    $grid.html(html);
  }

  function setupFleetDesktop() {
    var $grid = $("#fleetGrid");

    if ($grid.hasClass("slick-initialized")) {
      $grid.slick("unslick");
    }

    $grid.removeClass("fleet__grid--slick");
    initFleetImageSliders($grid);
  }

  function setupFleetMobile() {
    var $grid = $("#fleetGrid");

    $grid.addClass("fleet__grid--slick");

    if ($grid.hasClass("slick-initialized")) {
      $grid.slick("unslick");
    }

    initFleetImageSliders($grid);

    $grid.slick({
      dots: true,
      arrows: false,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true
    });
  }

  function initFleetSection() {
    if (!$("#fleetGrid").length || typeof $.fn.slick !== "function") {
      return;
    }

    renderAllFleetCards();

    if (fleetMobileMq.matches) {
      setupFleetMobile();
    } else {
      setupFleetDesktop();
    }
  }

  $(function () {
    // Fecha o menu mobile ao clicar em um link
    $("#mainNav .nav-link").on("click", function () {
      var $collapse = $("#mainNav");
      if ($collapse.hasClass("show")) {
        bootstrap.Collapse.getOrCreateInstance($collapse[0]).hide();
      }
    });

    // Marca item ativo no menu
    $(".site-nav .nav-link").on("click", function () {
      $(".site-nav .nav-link").removeClass("active");
      $(this).addClass("active");
    });

    // Placeholder do formulário de busca
    $(".booking-bar").on("submit", function (e) {
      e.preventDefault();
    });

    // Hero — slider de banners
    var $heroSlider = $("#heroSlider");
    if ($heroSlider.length && typeof $.fn.slick === "function") {
      if ($heroSlider.hasClass("slick-initialized")) {
        $heroSlider.slick("unslick");
      }

      $heroSlider.slick({
        dots: true,
        arrows: true,
        infinite: true,
        fade: true,
        cssEase: "linear",
        speed: 700,
        autoplay: true,
        autoplaySpeed: 4500,
        pauseOnHover: true,
        pauseOnFocus: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        prevArrow:
          '<button type="button" class="hero-arrow hero-arrow--prev" aria-label="Banner anterior"><i class="bi bi-chevron-left"></i></button>',
        nextArrow:
          '<button type="button" class="hero-arrow hero-arrow--next" aria-label="Próximo banner"><i class="bi bi-chevron-right"></i></button>'
      });
    }

    // Frota — desktop: grade completa / mobile: slick 1 por vez
    initFleetSection();

    if (typeof fleetMobileMq.addEventListener === "function") {
      fleetMobileMq.addEventListener("change", initFleetSection);
    } else if (typeof fleetMobileMq.addListener === "function") {
      fleetMobileMq.addListener(initFleetSection);
    }

    // Depoimentos — Slick
    var $testimonials = $("#testimonialsSlider");
    if ($testimonials.length && typeof $.fn.slick === "function") {
      if ($testimonials.hasClass("slick-initialized")) {
        $testimonials.slick("unslick");
      }

      $testimonials.slick({
        dots: true,
        arrows: true,
        infinite: true,
        autoplay: false,
        speed: 450,
        cssEase: "ease",
        slidesToShow: 3,
        slidesToScroll: 1,
        adaptiveHeight: false,
        prevArrow:
          '<button type="button" class="slick-prev testimonials__arrow" aria-label="Anterior"><i class="bi bi-chevron-left"></i></button>',
        nextArrow:
          '<button type="button" class="slick-next testimonials__arrow" aria-label="Próximo"><i class="bi bi-chevron-right"></i></button>',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true
            }
          }
        ]
      });
    }

    // Toastr leve
    function showSiteToast(type, title, message) {
      var $container = $("#siteToastContainer");
      if (!$container.length) return;

      var icon = type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill";
      var $toast = $(
        '<div class="site-toast site-toast--' + type + '" role="alert">' +
          '<div class="site-toast__icon"><i class="bi ' + icon + '"></i></div>' +
          '<div class="site-toast__body">' +
            '<p class="site-toast__title"></p>' +
            '<p class="site-toast__message"></p>' +
          "</div>" +
          '<button type="button" class="site-toast__close" aria-label="Fechar"><i class="bi bi-x-lg"></i></button>' +
        "</div>"
      );

      $toast.find(".site-toast__title").text(title);
      $toast.find(".site-toast__message").text(message);
      $container.append($toast);

      window.requestAnimationFrame(function () {
        $toast.addClass("is-visible");
      });

      var hideTimer = window.setTimeout(function () {
        hideToast($toast);
      }, 4500);

      $toast.find(".site-toast__close").on("click", function () {
        window.clearTimeout(hideTimer);
        hideToast($toast);
      });
    }

    function hideToast($toast) {
      $toast.removeClass("is-visible");
      window.setTimeout(function () {
        $toast.remove();
      }, 250);
    }

    // Orçamento — modal + envio
    var $budgetModal = $("#budgetModal");
    var $budgetForm = $("#budgetForm");
    var $budgetFeedback = $("#budgetFeedback");
    var budgetModalInstance = null;

    if ($budgetModal.length && window.bootstrap) {
      budgetModalInstance = bootstrap.Modal.getOrCreateInstance($budgetModal[0]);
    }

    function maskCpf(value) {
      return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function maskPhone(value) {
      return value
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    function formatDateBr(isoDate) {
      if (!isoDate) return "";
      var parts = isoDate.split("-");
      if (parts.length !== 3) return isoDate;
      return parts[2] + "/" + parts[1] + "/" + parts[0];
    }

    $("#budgetCpf").on("input", function () {
      this.value = maskCpf(this.value);
    });

    $("#budgetWhatsapp").on("input", function () {
      this.value = maskPhone(this.value);
    });

    $(document).on("click", "[data-budget-open]", function () {
      var categoriaLabel = $(this).attr("data-categoria-label") || "";
      var $select = $("#budgetCategoria");

      if (categoriaLabel) {
        var matched = false;
        $select.find("option").each(function () {
          if ($(this).val() === categoriaLabel) {
            matched = true;
            return false;
          }
        });

        if (!matched) {
          $select.append(
            $("<option>", { value: categoriaLabel, text: categoriaLabel })
          );
        }

        $select.val(categoriaLabel);
      }

      $budgetFeedback.prop("hidden", true).removeClass("is-success is-error").text("");
      if (budgetModalInstance) {
        budgetModalInstance.show();
      }
    });

    $budgetForm.on("submit", function (e) {
      e.preventDefault();

      if (!$budgetForm[0].checkValidity()) {
        $budgetForm[0].reportValidity();
        return;
      }

      var $submit = $("#budgetSubmit");
      var payload = {
        categoria: $("#budgetCategoria").val(),
        local: $("#budgetLocal").val(),
        data_retirada: formatDateBr($("#budgetDataRetirada").val()),
        hora_retirada: $("#budgetHoraRetirada").val(),
        data_devolucao: formatDateBr($("#budgetDataDevolucao").val()),
        hora_devolucao: $("#budgetHoraDevolucao").val(),
        nome: $("#budgetNome").val().trim(),
        cpf: $("#budgetCpf").val().trim(),
        email: $("#budgetEmail").val().trim(),
        whatsapp: $("#budgetWhatsapp").val().trim()
      };

      $submit.prop("disabled", true).html('<i class="bi bi-hourglass-split"></i> Enviando...');
      $budgetFeedback.prop("hidden", true).removeClass("is-success is-error");

      // Envio por e-mail via EmailJS (emailjs.com), sem servidor próprio.
      // Os modelos dos e-mails ficam no painel do EmailJS (cópias em /email-templates).
      var EMAILJS = {
        publicKey: "BWGA-e60DNIy4kaxQ",
        serviceId: "service_ob8qr9p",
        templateLocadora: "template_ee2rxe3",
        templateCliente: "template_lot2c8n"
      };

      function sendEmail(templateId) {
        return $.ajax({
          url: "https://api.emailjs.com/api/v1.0/email/send",
          method: "POST",
          contentType: "application/json; charset=utf-8",
          data: JSON.stringify({
            service_id: EMAILJS.serviceId,
            template_id: templateId,
            user_id: EMAILJS.publicKey,
            template_params: payload
          })
        });
      }

      sendEmail(EMAILJS.templateLocadora)
        .done(function () {
          // Confirmação para o cliente (se falhar, o orçamento já chegou na locadora).
          sendEmail(EMAILJS.templateCliente);

          $budgetForm[0].reset();
          $("#budgetLocal").val("Porto Seguro - BA");
          $budgetFeedback.prop("hidden", true).removeClass("is-success is-error").text("");

          if (budgetModalInstance) {
            budgetModalInstance.hide();
          }

          showSiteToast(
            "success",
            "Orçamento enviado!",
            "Solicitação enviada com sucesso. Você vai receber uma confirmação no seu e-mail."
          );
        })
        .fail(function () {
          var message = "Não foi possível enviar. Tente novamente ou fale conosco pelo WhatsApp.";
          $budgetFeedback.prop("hidden", false).addClass("is-error").text(message);
          showSiteToast("error", "Falha no envio", message);
        })
        .always(function () {
          $submit
            .prop("disabled", false)
            .html('<i class="bi bi-send-fill"></i> Enviar solicitação');
        });
    });
  });
})(jQuery);
