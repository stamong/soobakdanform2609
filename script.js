/* ==========================================
   SUPABASE 설정
   ↓↓↓ 여기 두 개만 네 값으로 바꾸기 ↓↓↓
========================================== */

const SUPABASE_URL =
  "https://fhugnnhwhmimvhakgzsp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_rBAfHYgfJB661vN0ROjSsg_S3EgweFO";


/* ==========================================
   HTML 요소
========================================== */

const form =
  document.getElementById("soobakForm");

const submitButton =
  document.getElementById("submitButton");

const statusMessage =
  document.getElementById("statusMessage");

const textareas =
  document.querySelectorAll("textarea");


/* ==========================================
   CLICK TO TYPE 표시 제어
========================================== */

textareas.forEach((textarea) => {

  textarea.addEventListener(
    "input",
    () => {

      const box =
        textarea.closest(".input-box");

      if (textarea.value.trim()) {

        box.classList.add("has-value");

      } else {

        box.classList.remove("has-value");

      }

    }
  );

});


/* ==========================================
   FORM 제출
========================================== */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    /* --------------------------------------
       입력값 가져오기
    -------------------------------------- */

    const name =
      document
        .getElementById("name")
        .value
        .trim();


    const address =
      document
        .getElementById("address")
        .value
        .trim();


    const recipe =
      document
        .getElementById("recipe")
        .value
        .trim();


    const privacyConsent =
      document
        .getElementById("privacyConsent")
        .checked;


    /* --------------------------------------
       입력값 확인
    -------------------------------------- */

    if (!name || !address || !recipe) {

      statusMessage.textContent =
        "모든 내용을 입력해주세요.";

      return;
    }


    if (!privacyConsent) {

      statusMessage.textContent =
        "개인정보 수집·이용 동의가 필요합니다.";

      return;
    }


    /* --------------------------------------
       제출 중 상태
    -------------------------------------- */

    submitButton.disabled = true;

    submitButton.textContent =
      "SENDING...";

    statusMessage.textContent =
      "제출 중입니다...";


    /* --------------------------------------
       Supabase로 데이터 전송
    -------------------------------------- */

    try {

      const response =
        await fetch(
          `${SUPABASE_URL}/rest/v1/responses`,
          {

            method: "POST",

            headers: {

              "apikey":
                SUPABASE_PUBLISHABLE_KEY,

              "Content-Type":
                "application/json",

              "Prefer":
                "return=minimal"

            },

            body: JSON.stringify({

              name: name,

              address: address,

              recipe: recipe

            })

          }
        );


      /* ------------------------------------
         Supabase 오류 발생
      ------------------------------------ */

      if (!response.ok) {

        const errorText =
          await response.text();


        console.error(
          "===== SUPABASE ERROR ====="
        );

        console.error(
          "STATUS:",
          response.status
        );

        console.error(
          "MESSAGE:",
          errorText
        );


        throw new Error(
          `${response.status} / ${errorText}`
        );

      }


      /* ------------------------------------
         제출 성공
      ------------------------------------ */

      console.log(
        "응답 저장 성공!"
      );


      form.reset();


      document
        .querySelectorAll(".input-box")
        .forEach(
          (box) => {

            box.classList.remove(
              "has-value"
            );

          }
        );


      statusMessage.textContent =
        "제출되었습니다. 감사합니다!";


    }


    /* --------------------------------------
       오류 표시
    -------------------------------------- */

    catch (error) {

      console.error(
        "===== SUBMIT ERROR ====="
      );

      console.error(error);


      statusMessage.textContent =
        "제출에 실패했습니다. 잠시 후 다시 시도해주세요.";

    }


    /* --------------------------------------
       버튼 원상복구
    -------------------------------------- */

    finally {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "SUBMIT";

    }

  }
);