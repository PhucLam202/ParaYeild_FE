const fs = require('fs');
const path = require('path');

const htmlFile = '/Users/cps/.gemini/antigravity/brain/dd855730-72b2-495c-b29c-97587ae60e89/simulator.html';
const html = fs.readFileSync(htmlFile, 'utf8');

const mainMatch = html.match(/<main([\s\S]*?)<\/main>/);
const footerMatch = html.match(/<footer([\s\S]*?)<\/footer>/);

let mainHtml = mainMatch ? '<main' + mainMatch[1] + '</main>' : '';
let footerHtml = footerMatch ? '<footer' + footerMatch[1] + '</footer>' : '';

// Convert HTML to JSX
const convertToJsx = (str) => {
    return str
        .replace(/class="/g, 'className="')
        .replace(/for="/g, 'htmlFor="')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<input([^>]*?)>/g, (match, attrs) => {
            if (attrs.endsWith('/')) return match;
            return `<input${attrs}/>`;
        })
        .replace(/<br>/g, '<br />')
        .replace(/<path([^>]*?)>/g, (match, attrs) => {
            if (attrs.endsWith('/')) return match;
            return `<path${attrs}/>`;
        })
        .replace(/<stop([^>]*?)>/g, (match, attrs) => {
            if (attrs.endsWith('/')) return match;
            return `<stop${attrs}/>`;
        })
        .replace(/stroke-width/g, 'strokeWidth')
        .replace(/stroke-dasharray/g, 'strokeDasharray')
        .replace(/stop-color/g, 'stopColor')
        .replace(/stop-opacity/g, 'stopOpacity')
        .replace(/<svg(.*?)preserve-3d(.*?)>/g, '<svg$1$2>')
};

mainHtml = convertToJsx(mainHtml);
footerHtml = convertToJsx(footerHtml);

const tsxContent = `import HeaderSection from "@/components/HeaderSection";

export default function SimulatorPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#021200] to-[#041B08] text-[#f1f1f1] font-sans selection:bg-[#00FFA3] selection:text-black">
            <HeaderSection />
            <div className="pt-20">
                ${mainHtml.split('\\n').join('\\n                ')}
                ${footerHtml.split('\\n').join('\\n                ')}
            </div>
        </div>
    );
}
`;

fs.mkdirSync('./src/app/simulator', { recursive: true });
fs.writeFileSync('./src/app/simulator/page.tsx', tsxContent);

console.log('Conversion complete');
