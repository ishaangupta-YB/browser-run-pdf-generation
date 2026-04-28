import puppeteer from "@cloudflare/puppeteer";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const generateDocument = (name: string) => {
  const participantName = escapeHtml(name);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page {
        size: 1024px 723px;
        margin: 0;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      body {
        display: grid;
        min-height: 100vh;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.2), rgba(22, 22, 22, 0) 35%),
          linear-gradient(135deg, #151515 0%, #333 17%, #222 33%, #3d3d3d 56%, #191919 100%);
        color: #050505;
        font-family: Georgia, "Times New Roman", Times, serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .certificate {
        position: relative;
        width: min(100vw, 1024px);
        aspect-ratio: 1024 / 723;
        overflow: hidden;
        background:
          radial-gradient(circle at 51% 39%, rgba(255, 255, 255, 0.74) 0 12%, rgba(235, 235, 235, 0.82) 29%, rgba(188, 188, 188, 0.9) 64%, rgba(145, 145, 145, 0.98) 100%),
          linear-gradient(90deg, #b3b3b3, #eeeeee 48%, #aaaaaa);
        box-shadow: inset 0 0 0 24px rgba(0, 0, 0, 0.82);
      }

      .certificate::before {
        position: absolute;
        inset: 45px 25px;
        z-index: 2;
        border: 4px solid rgba(8, 8, 8, 0.86);
        content: "";
        pointer-events: none;
      }

      .ribbon {
        position: absolute;
        z-index: 1;
        width: 330px;
        height: 170px;
        border-radius: 50%;
        border: 12px solid rgba(255, 255, 255, 0.75);
        filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.62));
        opacity: 0.92;
      }

      .ribbon::before,
      .ribbon::after {
        position: absolute;
        inset: -18px;
        border-radius: inherit;
        content: "";
      }

      .ribbon::before {
        border: 5px solid rgba(251, 93, 91, 0.68);
      }

      .ribbon::after {
        inset: 8px;
        border: 5px solid rgba(84, 181, 255, 0.7);
      }

      .ribbon.top-left {
        top: -78px;
        left: -108px;
        transform: rotate(70deg);
      }

      .ribbon.top-right {
        top: -82px;
        right: -62px;
        transform: rotate(15deg);
      }

      .ribbon.bottom-left {
        bottom: -95px;
        left: -54px;
        transform: rotate(61deg);
      }

      .ribbon.bottom-right {
        right: -70px;
        bottom: -88px;
        transform: rotate(128deg);
      }

      .content {
        position: relative;
        z-index: 3;
        display: flex;
        height: 100%;
        padding: 64px 55px 70px;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .brand-row {
        display: grid;
        width: 100%;
        grid-template-columns: 160px 1fr 220px 1fr 126px;
        align-items: start;
      }

      .vips-logo {
        justify-self: start;
        display: grid;
        width: 130px;
        height: 58px;
        grid-template-columns: 72px 1fr;
        align-items: center;
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(55, 55, 55, 0.42);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
      }

      .vips-main {
        color: #e32127;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 33px;
        font-weight: 900;
        letter-spacing: -3px;
        line-height: 0.85;
      }

      .vips-main small,
      .vips-years small {
        display: block;
        color: #1d1d1d;
        font-size: 6px;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 1.1;
      }

      .vips-years {
        border-left: 1px solid #9b9b9b;
        color: #777;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 30px;
        font-weight: 300;
        line-height: 0.86;
      }

      .aarvak {
        justify-self: center;
        margin-top: 5px;
        color: #f3f3f3;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 27px;
        font-weight: 700;
        letter-spacing: -1px;
        line-height: 1;
        text-shadow:
          -1px -1px 0 #202020,
          1px -1px 0 #202020,
          -1px 1px 0 #202020,
          1px 1px 0 #202020,
          0 2px 3px rgba(0, 0, 0, 0.36);
      }

      .aarvak::before {
        display: inline-block;
        width: 23px;
        height: 36px;
        margin-right: 3px;
        border-radius: 7px 2px 7px 2px;
        background: linear-gradient(135deg, #25d6c7 0 39%, #4d3adf 39% 66%, #f0f0f0 66%);
        content: "";
        vertical-align: -9px;
        transform: skew(-18deg);
      }

      .aarvak small {
        display: block;
        margin-top: 2px;
        color: #fff;
        font-size: 6px;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .hackerrank {
        justify-self: center;
        margin-top: 10px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 30px;
        font-weight: 800;
        letter-spacing: -1px;
      }

      .hackerrank::after {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: 5px;
        background: #2ec866;
        content: "";
        vertical-align: 1px;
      }

      .tisec {
        justify-self: end;
        width: 90px;
        color: #5a4b40;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 7px;
        font-weight: 600;
        line-height: 1.05;
        text-align: center;
      }

      .tisec-mark {
        width: 55px;
        height: 46px;
        margin: 0 auto 2px;
        border-radius: 50% 50% 45% 45%;
        background:
          radial-gradient(circle at 24% 18%, #8b2a21 0 4px, transparent 5px),
          radial-gradient(circle at 47% 9%, #da6d3f 0 5px, transparent 6px),
          radial-gradient(circle at 68% 19%, #5aa9bd 0 6px, transparent 7px),
          linear-gradient(165deg, #45b4c8 0 33%, #f4b447 33% 58%, #6d9cb5 58%);
      }

      .tisec-name {
        display: block;
        margin-top: 2px;
        padding: 2px 8px 1px;
        background: #4bb4c7;
        color: #fff;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .title {
        margin: 32px 0 0;
        font-size: clamp(52px, 8.3vw, 82px);
        font-weight: 900;
        line-height: 0.92;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .subtitle {
        display: grid;
        width: min(430px, 54%);
        margin-top: 10px;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 13px;
        font-size: 30px;
        font-weight: 800;
        line-height: 1;
        text-transform: uppercase;
      }

      .subtitle::before,
      .subtitle::after {
        height: 2px;
        background: #42224b;
        content: "";
      }

      .round {
        margin-top: 4px;
        font-size: 15px;
        letter-spacing: 3.5px;
        text-transform: uppercase;
      }

      .clarify {
        margin-top: 14px;
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 5px;
      }

      .name {
        margin-top: 23px;
        font-family: "Brush Script MT", "Segoe Script", "Snell Roundhand", cursive;
        font-size: clamp(52px, 7vw, 70px);
        font-style: italic;
        font-weight: 600;
        line-height: 0.95;
      }

      .name::before {
        margin-right: 13px;
        font-family: Georgia, "Times New Roman", Times, serif;
        font-style: normal;
        font-weight: 900;
      }

      .name::after {
        margin-left: 13px;
        font-family: Georgia, "Times New Roman", Times, serif;
        font-style: normal;
        font-weight: 900;
      }

      .name-rule {
        width: min(432px, 49vw);
        height: 3px;
        margin-top: 26px;
        background: #42224b;
      }

      .description {
        max-width: 690px;
        margin: 27px 0 0;
        font-size: 25px;
        line-height: 1.18;
        letter-spacing: 0.6px;
      }

      .description strong {
        font-weight: 800;
      }

      @media (max-width: 760px) {
        body {
          overflow: auto;
        }

        .certificate {
          min-width: 720px;
        }
      }
    </style>
  </head>

  <body>
    <main class="certificate" aria-label="Certificate of participation">
      <span class="ribbon top-left"></span>
      <span class="ribbon top-right"></span>
      <span class="ribbon bottom-left"></span>
      <span class="ribbon bottom-right"></span>

      <section class="content">
        <header class="brand-row" aria-label="Organizer logos">
          <div class="vips-logo" aria-label="VIPS 25 years in service of humanity">
            <span class="vips-main">VIPS<small>Vivekananda Institute of Professional Studies</small></span>
            <span class="vips-years">25<small>Years in service of humanity</small></span>
          </div>
          <div class="aarvak">aarvak<small>the AI and Tech Society</small></div>
          <div class="hackerrank">HackerRank</div>
          <div></div>
          <div class="tisec">
            <div class="tisec-mark" aria-hidden="true"></div>
            Technical Innovation and Entrepreneurship Support Cell
            <span class="tisec-name">TISEC</span>
          </div>
        </header>

        <h1 class="title">Certificate</h1>
        <div class="subtitle">of participation</div>
        <div class="round">in offline round</div>
        <div class="clarify">This is Clarify to that</div>
        <div class="name">${participantName}</div>
        <div class="name-rule" aria-hidden="true"></div>
        <p class="description">
          Participated in <strong>&lsquo;Code Royale: The Final Iteration Hackathon&rsquo;</strong> held
          on <strong>8th April 2026</strong>, organized by <strong>VIPS HackerRank &times; AARVAK</strong>,
          where the participant engaged in competitive coding, problem-solving,
          and collaborative learning.
        </p>
      </section>
    </main>
  </body>
</html>
`;
};

export default {
  async fetch(request, env) {
    const { searchParams } = new URL(request.url);
    let name = searchParams.get("name");

    if (!name) {
      return new Response("Please provide a name using the ?name= parameter");
    }

    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();

    // Step 1: Define HTML and CSS
    const document = generateDocument(name);

    // Step 2: Send HTML and CSS to our browser
    await page.setContent(document);

    // Step 3: Generate and return PDF
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });

    // Close browser since we no longer need it
    await browser.close();

    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
      },
    });
  },
} satisfies ExportedHandler<Env>;
