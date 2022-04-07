/**
 * QrcodeHandler初始化
 */

export const initQrcodeHandler = () => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "/qrcode-with-logo.min.js";
    document.head.appendChild(script);
}


/**
 * 生成QRcode
 * @param {String} generate_link 要轉換的連結
 * @param {ElementById} qrcode_area_id 要顯示的位置
 */
export const generateQrcodeHandler = (
    generate_link,
    qrcode_area_id = "qrcode"
) => {
    const qrcode_area = document.getElementById(qrcode_area_id);
    const canvas_area = document.createElement("canvas");
    const image_area = document.createElement("img");

    const log = new QrCodeWithLogo({
        canvas: canvas_area,
        content: generate_link,
        width: 380,
        // download: true,
        image: image_area,
        logo: {
            src: "/logo.jpg",
        },
    })
        .toImage()
        .then(() => {
            console.log("qrcode 建立成功", generate_link);
            qrcode_area.appendChild(image_area);
        });
};