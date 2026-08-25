

async function test() {
  const req = {
    topic: "Cyber Security",
    code: "",
    history: [],
    isFixRequest: false,
    mode: "learning"
  };

  const res = await fetch("https://graduatenex.online/api/practice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });

  const data = await res.json();
  console.log("Response:", data);
}

test();
