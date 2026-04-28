import puppeteer from "@cloudflare/puppeteer";

const generateDocument = (name: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      html,
      body,
      #container {
        width: 100%;
        height: 100%;
        margin: 0;
      }
      body {
        font-family: Baskerville, Georgia, Times, serif;
        background-color: #f7f1dc;
      }
      strong {
        color: #5c594f;
        font-size: 128px;
        margin: 32px 0 48px 0;
      }
      em {
        font-size: 24px;
      }
      #container {
        flex-direction: column;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div id="container">
      <em>This is to certify that</em>
      <strong>${name}</strong>
      <em>has rendered a PDF using Cloudflare Workers</em>
    </div>
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
    const pdf = await page.pdf({ printBackground: true });

    // Close browser since we no longer need it
    await browser.close();

    return new Response(pdf, {
      headers: {
        "content-type": "application/pdf",
      },
    });
  },
} satisfies ExportedHandler<Env>;
