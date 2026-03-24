(async () => {
    try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI("AIzaSyBK_dPjffOehpntO0YkFOXwKjVNwybZ7EY");
        const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imgUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_dog.jpg/320px-Cute_dog.jpg';
        const imgRes = await fetch(imgUrl);
        const imgBuffer = await imgRes.arrayBuffer();

        const imagePart = {
          inlineData: {
            data: Buffer.from(imgBuffer).toString("base64"),
            mimeType: "image/jpeg"
          }
        };

        const prompt = "You are an AI moderator for a citizen reporting app. Does this uploaded image show a real community hazard or infrastructure problem (e.g. garbage, pothole, leak, damage, street hazard, dirt)? Or is it irrelevant (e.g. dog, pet, person, selfie, meme, drawing)? If it is a real hazard, reply 'VALID'. If it is an animal, person, or irrelevant, reply 'INVALID'.";

        console.log("Sending to Gemini...");
        const result = await aiModel.generateContent([prompt, imagePart]);
        const aiResponse = result.response.text();
        console.log("Gemini Raw Response:", aiResponse);
        
    } catch (e) {
        console.error("Gemini Error:", e.message);
        console.error(e);
    }
})();
