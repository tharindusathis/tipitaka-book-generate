import fs from 'fs';
import { mdToPdf } from 'md-to-pdf';
import { TipitakaFile } from './TipitakaFile';
import { beautifyText } from './TextConvert';


const fontNotoMedium = fs.readFileSync(`${__dirname}/../assets/fonts/NotoSansSinhala-Medium.ttf`).toString('base64');
const fontUNAbhaya = fs.readFileSync(`${__dirname}/../assets/fonts/UN-Abhaya.ttf`).toString('base64');
const fontUNAbhayaBold = fs.readFileSync(`${__dirname}/../assets/fonts/UN-Abhaya-bold.ttf`).toString('base64');
const fontUNArundathee = fs.readFileSync(`${__dirname}/../assets/fonts/UN-Arundathee.ttf`).toString('base64');
const fontNotoMedium_css = `
@font-face {
    font-family: 'Noto';
    font-style:  normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${fontNotoMedium}) format('woff2');
}`
const fontUNArundathee_css = `
@font-face {
    font-family: 'Noto';
    font-style:  normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${fontUNArundathee}) format('woff2');
}`
const fontUNAbhaya_css = `
@font-face {
    font-family: 'Abhaya';
    font-style:  normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${fontUNAbhaya}) format('woff2');
}
@font-face {
    font-family: 'Abhaya';
    font-style:  normal;
    font-weight: bold;
    src: url(data:font/woff2;charset=utf-8;base64,${fontUNAbhayaBold}) format('woff2');
}`

log("Start");
generateMarkdown("brahmajala_sutta", "dn-1", 1, 81);

log("Done");


function generateMarkdown(suttaName: string, dataFileName: string, pageFrom: number, pageTo: number) {
    let mdPath = `${__dirname}/../generated/${suttaName}_${pageFrom}_${pageTo}.md`;
    fs.writeFileSync(mdPath, getText(dataFileName, pageFrom, pageTo));

    (async () => {
        await mdToPdf(
            {
                path: mdPath,
            },
            {
                dest: `${mdPath}.pdf`,
                css: [fontUNAbhaya_css, "* { font-size: 50px; font-family: Abhaya}"].join("\n"),
                pdf_options: {
                    margin: {
                        bottom: "0",
                        top: "0",
                        left: "0",
                        right: "0"
                    }
                }
            }).then(pdf => {
                if (pdf.filename) {
                    log(pdf.filename);
                    fs.writeFileSync(pdf.filename, pdf.content);
                }
            }).catch(console.error);
        log("Pdf generated")
    })();
}

function log(msg: string) {
    console.log("[LOG]", msg);
}

function getText(filename: string, pageFrom: number, pageTo: number): string {
    filename = `${__dirname}/../pathnirvana/tipitaka.lk/public/static/text/${filename}.json`
    let fullText: string[] = [];
    let tipitakaFile: TipitakaFile = JSON.parse(fs.readFileSync(filename, 'utf8'));
    tipitakaFile.pages
        .filter(page => page.pageNum >= pageFrom && page.pageNum <= pageTo)
        .forEach(page => {
            fullText.push(`(${page.pageNum},${page.pageNum + 1})`);
            page.pali.entries.forEach((entry, idx) => {
                if (entry.type != "paragraph") {
                    fullText.push(beautifyText(entry.text, "pali", true, true));
                } else {
                    fullText.push(beautifyText(entry.text.replace(/(?<=\d+)\./, "P."), "pali", true, true));
                    fullText.push(page.sinh.entries[idx].text.replace(/(?<=\d+)\./, "S."));
                }
            });
        });

    return fullText.join("\n\n");
}
