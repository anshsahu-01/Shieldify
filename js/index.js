console.log("This is my script")

let result = { "tag": "", 
    "free": false, 
    "role": false, 
    "user": "akshaykumar", 
    "email": "akshaykumar@codewithharry.com", 
    "score": 0.64, 
    "state": "undeliverable", 
    "domain": "codewithharry.com", 
    "reason": "invalid_mailbox", 
    "mx_found": true, 
    "catch_all": null, 
    "disposable": false, 
    "smtp_check": false, 
    "did_you_mean": "", 
    "format_valid": true, 
    "True-user":true, 
}

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    console.log("Clicked!")
    resultCont.innerHTML = `<img width="123" src="img/loading.svg" alt="">`

    let key = "ema_live_Vgt8a3mvDdCwQnUs3MWEG2NV3zHqhovTymv6N5uT"
    let email = document.getElementById("username").value 
    let url = `https://api.emailvalidation.io/v1/info?apikey=${key}&email=${email}`
    let res = await fetch(url)
    let result = await res.json()

    let str = ``;
    for (let key of Object.keys(result)) {
        if(result[key] !== "" && result[key]!== " "){ 
            str = str + `<div>${key}: ${result[key]}</div>`
        }
    }

    // Pehle text results show karo
    resultCont.innerHTML = str;

    // Uske baad risk bar bhi append karo
    showRiskBar(result);
})

function showRiskBar(result) {
  // Pehle purane risk bar ko hata do agar hai
  let oldBar = document.querySelector(".risk-bar-fill");
  if (oldBar) oldBar.remove();

  // Naya risk bar banao
  let riskFill = document.createElement("div");
  riskFill.className = "risk-bar-fill";
  riskFill.style.width = (result.score * 100) + "%";
  riskFill.style.background = result.score > 0.7 ? "red" : result.score > 0.3 ? "orange" : "green";
  riskFill.innerText = Math.round(result.score * 100) + "% Risk";

  document.getElementById("resultCont").appendChild(riskFill);
}


document.getElementById("downloadReport").addEventListener("click", () => {
    // Fake report content
    const reportContent = `
        Scam Detection Report
        ---------------------
        ✅ Safe Transactions: 5
        ⚠️ Suspicious Transactions: 2
        ❌ Confirmed Scams: 1

        Recommendation:
        Do not click on unknown links or share OTP/UPI PIN.
    `;

    // Convert to Blob
    const blob = new Blob([reportContent], { type: "text/plain" });

    // Create a link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "scam_report.txt"; // file ka naam
    link.click();
});


function analyzeMessage() {
  let msg = document.getElementById("userMessage").value.toLowerCase();
  let result = "";
  
  // Basic scam keyword check
  if(msg.includes("lottery") || msg.includes("urgent") || 
     msg.includes("click here") || msg.includes("verify account") ||
     msg.includes("win") || msg.includes("free") || msg.includes("prize")) {
    result = "<p style='color:red'><b>⚠️ Suspicious Message:</b> This could be a scam. Do not click on any links or share details.</p>";
  } else if(msg.trim() === "") {
    result = "<p style='color:orange'>Please enter a message to analyze.</p>";
  } else {
    result = "<p style='color:green'><b>✅ Looks Safe:</b> No common scam indicators found. Still, be careful!</p>";
  }

  document.getElementById("analysisResult").innerHTML = result;}


  const fraudDatabase = {
      "lottery": { cases: 5231, description: "Lottery scam where victim is told they won a big prize." },
      "bank": { cases: 3178, description: "Fake bank account update or card block message." },
      "otp": { cases: 2894, description: "Scammer asks for OTP pretending to be official." },
      "job": { cases: 1867, description: "Fake job offer scams leading to money loss." },
      "prince": { cases: 945, description: "Scammer claims to be a rich foreigner needing help." }
    };

    function analyzeMessage() {
      let msg = document.getElementById("userMessage").value.toLowerCase();
      let result = "";
      let fraudType = null;

      if (msg.includes("lottery") || msg.includes("congratulations")) {
        fraudType = "lottery";
      } else if (msg.includes("bank") || msg.includes("account")) {
        fraudType = "bank";
      } else if (msg.includes("otp") || msg.includes("password")) {
        fraudType = "otp";
      } else if (msg.includes("job") || msg.includes("vacancy")) {
        fraudType = "job";
      } else if (msg.includes("prince") || msg.includes("inheritance")) {
        fraudType = "prince";
      }

      if (fraudType) {
        result = `<p><b>⚠️ Suspicious Message Detected!</b></p>
                  <p>Type: <b>${fraudType.toUpperCase()}</b></p>
                  <p>Description: ${fraudDatabase[fraudType].description}</p>
                  <p>📊 Reported Fraud Cases: <b>${fraudDatabase[fraudType].cases}</b></p>`;
      } else {
        result = "<p>✅ This message doesn't match known scam patterns.</p>";
      }

      document.getElementById("analysisResult").innerHTML = result;
    }