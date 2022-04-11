/**
 * QrcodeHandler初始化
 */

export const initQrcodeHandler = () => {


    return new Promise((resolve, reject) => {
        if (document.head.querySelector("script#qrcode-with-logo")) { resolve(); };



        try {
            if (QrCodeWithLogo) {
                console.log("已經有 QrCodeWithLogo done");
                resolve();
            }
        } catch (error) {
            console.log("初始化QrCodeWithLogo");
            var script = document.createElement("script");
            script.id = "qrcode-with-logo"
            script.type = "text/javascript";
            script.src = "/qrcode-with-logo.min.js";
            document.head.appendChild(script);
        }


        const x = setInterval(() => {
            try {
                if (QrCodeWithLogo) {
                    console.log("初始化QrCodeWithLogo done");
                    clearInterval(x)
                    resolve();
                }
            } catch (error) {
                console.log("初始化QrCodeWithLogo ing");

            }
        }, 1);

    });







}


/**
 * 生成QRcode
 * @param {String} generate_link 要轉換的連結
 * @param {ElementById} qrcode_area_id 要顯示的位置
 */
export const generateQrcodeHandler = async (
    generate_link,
    qrcode_area_id = "qrcode"
) => {
    if (document.head.querySelector("script#qrcode-with-logo") == null) await initQrcodeHandler();

    console.log('開始建立初始化QrCodeWithLogo');
    const qrcode_area = document.getElementById(qrcode_area_id);
    if (qrcode_area.querySelector('img')) qrcode_area.querySelector('img').remove();
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