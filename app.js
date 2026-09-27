const STORAGE_KEY = "greenpoint_state_v1";

const defaultState = {
  loggedIn: true,
  user: { name: "น้องกรีน", email: "green@example.com", phone:"", area:"หาดใหญ่", points:1850, weight:12.4, activities:17 },
  checkedDays: [1,2,3,4,7,8,10,11,12,14,15,17,18,21,22,24,25,26],
  missionsClaimed: [],
  redemptions: [],
  notifications: [
    {id:1,type:"reward",title:"ของรางวัลใหม่เข้าแล้ว! 🎁",body:"แก้วน้ำ Refill Cup รุ่นใหม่ ใช้ 650 แต้มแลกได้แล้ว",time:"วันนี้ • 10:42",unread:true},
    {id:2,type:"mission",title:"ภารกิจสุดสัปดาห์",body:"เก็บขวด PET ครบ 10 ขวด รับโบนัส +80 แต้ม",time:"เมื่อวาน • 18:20",unread:true},
    {id:3,type:"system",title:"เช็กอินสำเร็จ",body:"วันนี้คุณได้รับ +10 แต้มเรียบร้อยแล้ว",time:"26 ก.ย. • 08:15",unread:false}
  ],
  history: [
    {id:1,type:"earn",icon:"♻",title:"นำขวด PET 5 ขวดมาส่ง",date:"28 ก.ย. 2026 • 09:12",value:100},
    {id:2,type:"earn",icon:"🌱",title:"ภารกิจปลูกต้นไม้สำเร็จ",date:"27 ก.ย. 2026 • 16:40",value:50},
    {id:3,type:"spend",icon:"🥤",title:"แลก Refill Cup",date:"25 ก.ย. 2026 • 12:30",value:650},
    {id:4,type:"earn",icon:"🚲",title:"เดินทางแบบ Eco",date:"24 ก.ย. 2026 • 18:05",value:30},
    {id:5,type:"earn",icon:"📦",title:"นำกระดาษ 2 kg มาส่ง",date:"23 ก.ย. 2026 • 11:25",value:80},
    {id:6,type:"earn",icon:"✦",title:"เช็กอินรายวัน",date:"22 ก.ย. 2026 • 08:30",value:10},
  ],
  settings: {mission:true,reward:true,data:false}
};

const missions = [
  {id:"m1",icon:"🧴",title:"ขวด PET 5 ขวด",desc:"แยกขวดใส ล้างให้สะอาด และนำมาส่ง",points:100},
  {id:"m2",icon:"🥫",title:"กระป๋องอลูมิเนียม",desc:"สะสมกระป๋อง 10 ใบ รับแต้มพิเศษ",points:80},
  {id:"m3",icon:"📦",title:"กระดาษ 2 kg",desc:"รวบรวมกระดาษที่ใช้แล้ว 2 กก.",points:80},
  {id:"m4",icon:"🌱",title:"ภารกิจปลูกต้นไม้",desc:"เข้าร่วมกิจกรรมปลูกต้นไม้ชุมชน",points:50},
  {id:"m5",icon:"🚲",title:"เดินทางแบบ Eco",desc:"บันทึกการเดินทางด้วยจักรยาน/ขนส่งสาธารณะ",points:30},
  {id:"m6",icon:"💧",title:"Refill Challenge",desc:"พกขวดส่วนตัวแทนขวดใช้ครั้งเดียว",points:25},
  {id:"m7",icon:"🧹",title:"เก็บขยะรอบบ้าน",desc:"เก็บขยะบริเวณบ้านหรือชุมชน 30 นาที",points:60},
  {id:"m8",icon:"🍃",title:"แยกขยะ 4 ประเภท",desc:"ฝึกคัดแยกขยะให้ถูกประเภท",points:40}
];

const rewards = [
  {id:"r1",icon:"🥤",name:"Refill Cup แก้วรักษ์โลก",category:"แก้วและขวด",price:650,desc:"แก้วพกพา 500 ml วัสดุ BPA Free"},
  {id:"r2",icon:"👜",name:"ถุงผ้า GreenPoint",category:"ถุงผ้า",price:500,desc:"ถุงผ้าพับได้ ลายใบไม้"},
  {id:"r3",icon:"🌿",name:"ต้นมอนสเตอร่าไซซ์มินิ",category:"ต้นไม้",price:800,desc:"ต้นไม้ฟอกอากาศพร้อมกระถาง"},
  {id:"r4",icon:"☕",name:"แก้วกาแฟ Reuse",category:"แก้วและขวด",price:700,desc:"แก้วเซรามิกโทนพาสเทล"},
  {id:"r5",icon:"🎟️",name:"คูปองเครื่องดื่ม 50 บาท",category:"คูปอง",price:900,desc:"ใช้กับร้านค้าที่ร่วมรายการ"},
  {id:"r6",icon:"🌱",name:"ชุดปลูกต้นไม้เล็ก",category:"ต้นไม้",price:950,desc:"เมล็ดพันธุ์ + ดิน + กระถางย่อยสลายได้"},
  {id:"r7",icon:"🧃",name:"Bottle Carrier",category:"ถุงผ้า",price:750,desc:"สายรัดขวดพกพา รุ่น Reuse"},
  {id:"r8",icon:"🎫",name:"คูปองส่วนลดร้าน Eco 100 บาท",category:"คูปอง",price:1500,desc:"ส่วนลดสำหรับสินค้าเพื่อสิ่งแวดล้อม"}
];

let state = loadState();
let currentPage = "home";
let currentCategory = "ทั้งหมด";

function loadState(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? {...defaultState,...JSON.parse(saved)} : structuredClone(defaultState);
  }catch(e){ return structuredClone(defaultState); }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatNumber(n){
  return Number(n).toLocaleString("th-TH");
}

function initials(name){
  return (name || "GP")
    .split(/\s+/)
    .map(x=>x[0])
    .slice(0,2)
    .join("")
    .toUpperCase();
}

function toast(msg){
  const el = document.getElementById("toast");

  el.textContent = msg;
  el.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(()=>{
    el.classList.remove("show");
  },2600);
}

function showModal(html){
  document.getElementById("modalBody").innerHTML = html;

  document
    .getElementById("modalBackdrop")
    .classList.remove("hidden");
}

function closeModal(){
  document
    .getElementById("modalBackdrop")
    .classList.add("hidden");
}

function navigate(page){
  currentPage = page;

  document
    .querySelectorAll(".page")
    .forEach(p=>p.classList.remove("active"));

  document
    .getElementById(`page-${page}`)
    ?.classList.add("active");

  document
    .querySelectorAll(".side-item,.mobile-nav button")
    .forEach(b=>{
      b.classList.toggle(
        "active",
        b.dataset.page === page
      );
    });

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  renderAll();
}

function setupAuth(){

  document
    .querySelectorAll(".auth-tab")
    .forEach(tab=>{

      tab.addEventListener("click",()=>{

        document
          .querySelectorAll(".auth-tab")
          .forEach(x=>{
            x.classList.remove("active");
          });

        tab.classList.add("active");

        const isLogin =
          tab.dataset.auth === "login";

        document
          .getElementById("loginForm")
          .classList.toggle(
            "hidden",
            !isLogin
          );

        document
          .getElementById("registerForm")
          .classList.toggle(
            "hidden",
            isLogin
          );

      });

    });


  document
    .querySelectorAll(".eye-btn")
    .forEach(btn=>{

      btn.addEventListener("click",()=>{

        const input =
          document.getElementById(
            btn.dataset.password
          );

        input.type =
          input.type === "password"
            ? "text"
            : "password";

      });

    });


  document
    .getElementById("loginForm")
    .addEventListener("submit",e=>{

      e.preventDefault();

      const email =
        document
          .getElementById("loginEmail")
          .value
          .trim();

      state.loggedIn = true;

      state.user.email =
        email || state.user.email;

      saveState();

      showApp();

      toast(
        "เข้าสู่ระบบสำเร็จ 🌿"
      );

    });


  document
    .getElementById("registerForm")
    .addEventListener("submit",e=>{

      e.preventDefault();

      const password =
        document
          .getElementById("registerPassword")
          .value;

      const confirm =
        document
          .getElementById("registerConfirm")
          .value;

      if(password !== confirm){

        toast(
          "รหัสผ่านไม่ตรงกัน"
        );

        return;
      }

      state.loggedIn = true;

      state.user.name =
        document
          .getElementById("registerName")
          .value
          .trim();

      state.user.email =
        document
          .getElementById("registerEmail")
          .value
          .trim();

      saveState();

      showApp();

      toast(
        "สร้างบัญชีสำเร็จ ยินดีต้อนรับ 🎉"
      );

    });


  document
    .getElementById("demoLogin")
    .addEventListener("click",()=>{

      state.loggedIn = true;

      saveState();

      showApp();

      toast(
        "เข้าสู่โหมดทดลองใช้งาน"
      );

    });


  document
    .getElementById("forgotBtn")
    .addEventListener("click",()=>{

      showModal(`
        <h2>ลืมรหัสผ่าน</h2>

        <p>
          ระบบตัวอย่างนี้ยังไม่ได้เชื่อมต่ออีเมลจริง
          กรุณาสร้างบัญชีทดลองใหม่
          หรือใช้โหมดทดลองใช้งาน
        </p>

        <button
          class="primary-btn full"
          onclick="closeModal()"
        >
          เข้าใจแล้ว
        </button>
      `);

    });
}

function showApp(){

  document
    .getElementById("splashScreen")
    .classList.add("hidden");

  document
    .getElementById("authScreen")
    .classList.add("hidden");

  document
    .getElementById("appScreen")
    .classList.remove("hidden");

  renderAll();
}

function showAuth(){

  document
    .getElementById("splashScreen")
    .classList.add("hidden");

  document
    .getElementById("appScreen")
    .classList.add("hidden");

  document
    .getElementById("authScreen")
    .classList.remove("hidden");
}

function renderAll(){

  const u = state.user;

  const name =
    u.name || "น้องกรีน";

  document.getElementById(
    "homeGreeting"
  ).textContent = name;

  document.getElementById(
    "homePoints"
  ).textContent =
    formatNumber(u.points);

  document.getElementById(
    "pointsBalance"
  ).textContent =
    formatNumber(u.points);

  document.getElementById(
    "redeemBalance"
  ).textContent =
    formatNumber(u.points);

  document.getElementById(
    "homeWeight"
  ).textContent =
    `${u.weight.toFixed(1)} kg`;

  document.getElementById(
    "profileName"
  ).textContent =
    name;

  document.getElementById(
    "profileEmail"
  ).textContent =
    u.email || "-";

  document.getElementById(
    "headerAvatar"
  ).textContent =
    initials(name);

  document.getElementById(
    "profileAvatar"
  ).textContent =
    initials(name);

  document.getElementById(
    "profilePoints"
  ).textContent =
    formatNumber(u.points);

  document.getElementById(
    "editName"
  ).value = name;

  document.getElementById(
    "editEmail"
  ).value = u.email || "";

  document.getElementById(
    "editPhone"
  ).value = u.phone || "";

  document.getElementById(
    "editArea"
  ).value = u.area || "";

  document.getElementById(
    "sideNotifCount"
  ).textContent =
    state.notifications.filter(
      n=>n.unread
    ).length;

  document.getElementById(
    "notifDot"
  ).style.display =
    state.notifications.some(
      n=>n.unread
    )
      ? "block"
      : "none";

  renderCalendar();
  renderMissions();
  renderRewards();
  renderEarn();
  renderChart();
  renderHistory();
  renderNotifications();

  const earned =
    state.history
      .filter(x=>x.type==="earn")
      .reduce(
        (a,b)=>a+b.value,
        0
      );

  const spent =
    state.history
      .filter(x=>x.type==="spend")
      .reduce(
        (a,b)=>a+b.value,
        0
      );

  document.getElementById(
    "totalEarn"
  ).textContent =
    formatNumber(earned);

  document.getElementById(
    "totalSpend"
  ).textContent =
    formatNumber(spent);

  document.getElementById(
    "totalActivities"
  ).textContent =
    state.history.length;

  document.getElementById(
    "toggleMission"
  ).checked =
    state.settings.mission;

  document.getElementById(
    "toggleReward"
  ).checked =
    state.settings.reward;

  document.getElementById(
    "toggleData"
  ).checked =
    state.settings.data;
}

function renderCalendar(){

  const el =
    document.getElementById(
      "checkinCalendar"
    );

  el.innerHTML = "";

  const start = 22;
  const days = 7;

  for(let i=0;i<days;i++){

    const d = start+i;

    const done =
      state.checkedDays.includes(d);

    const div =
      document.createElement("div");

    div.className =
      `day-dot ${
        done ? "done" : ""
      } ${
        d === 28 ? "today" : ""
      }`;

    div.textContent = d;

    el.appendChild(div);
  }

  const checkedToday =
    state.checkedDays.includes(28);

  const btn =
    document.getElementById(
      "checkinBtn"
    );

  btn.disabled =
    checkedToday;

  btn.style.opacity =
    checkedToday ? ".6" : "1";

  btn.textContent =
    checkedToday
      ? "✓ เช็กอินวันนี้แล้ว"
      : "เช็กอินรับ 10 แต้ม";
}

function renderMissions(){

  const missionHTML =
    missions.map(m=>`

      <article class="mission-card">

        <div class="mission-thumb">
          ${m.icon}
        </div>

        <div class="mission-body">

          <h4>
            ${m.title}
          </h4>

          <p>
            ${m.desc}
          </p>

          <div class="mission-foot">

            <span class="points-tag">
              +${m.points} แต้ม
            </span>

            <button
              class="mini-btn"
              onclick="
                claimMission('${m.id}')
              "
            >
              ${
                state.missionsClaimed.includes(m.id)
                  ? "✓ รับแล้ว"
                  : "ทำภารกิจ"
              }
            </button>

          </div>

        </div>

      </article>

    `).join("");

  document.getElementById(
    "missionGrid"
  ).innerHTML =
    missionHTML;

  document.getElementById(
    "allMissions"
  ).innerHTML =
    missionHTML;
}

function claimMission(id){

  const m =
    missions.find(
      x=>x.id===id
    );

  if(!m) return;

  if(
    state.missionsClaimed
      .includes(id)
  ){

    toast(
      "ภารกิจนี้รับแต้มไปแล้วในรอบนี้"
    );

    return;
  }

  state.missionsClaimed.push(id);

  state.user.points +=
    m.points;

  state.user.activities++;

  state.history.unshift({

    id:Date.now(),

    type:"earn",

    icon:m.icon,

    title:m.title,

    date:
      "28 ก.ย. 2026 • ตอนนี้",

    value:m.points

  });

  saveState();

  renderAll();

  toast(
    `สำเร็จ! +${m.points} แต้ม 🌱`
  );
}

function renderRewards(){

  const filtered =
    currentCategory === "ทั้งหมด"
      ? rewards
      : rewards.filter(
          r=>
            r.category ===
            currentCategory
        );

  const cards =
    filtered.map(r=>`

      <article class="reward-card">

        <div class="reward-image">
          ${r.icon}
        </div>

        <div class="reward-body">

          <h4>
            ${r.name}
          </h4>

          <p>
            ${r.desc}
          </p>

          <div class="reward-foot">

            <span class="reward-price">
              ✦
              ${formatNumber(r.price)}
            </span>

            <button
              class="mini-btn"
              onclick="
                redeemReward('${r.id}')
              "
            >
              แลกเลย
            </button>

          </div>

        </div>

      </article>

    `).join("");

  document.getElementById(
    "rewardGrid"
  ).innerHTML =
    cards;

  document.getElementById(
    "homeRewards"
  ).innerHTML =

    rewards
      .slice(0,4)
      .map(r=>`

        <article class="reward-card">

          <div class="reward-image">
            ${r.icon}
          </div>

          <div class="reward-body">

            <h4>
              ${r.name}
            </h4>

            <div class="reward-foot">

              <span class="reward-price">
                ✦
                ${formatNumber(r.price)}
              </span>

              <button
                class="mini-btn"
                onclick="
                  redeemReward('${r.id}')
                "
              >
                แลก
              </button>

            </div>

          </div>

        </article>

      `)
      .join("");

  document
    .querySelectorAll(".category-btn")
    .forEach(b=>{

      b.classList.toggle(
        "active",
        b.dataset.category ===
          currentCategory
      );

    });
}

function redeemReward(id){

  const r =
    rewards.find(
      x=>x.id===id
    );

  if(!r) return;

  if(
    state.user.points <
    r.price
  ){

    toast(
      `แต้มยังไม่พอ ต้องการอีก ${
        formatNumber(
          r.price -
          state.user.points
        )
      } แต้ม`
    );

    return;
  }

  showModal(`

    <div
      style="
        text-align:center
      "
    >

      <div
        style="
          font-size:65px
        "
      >
        ${r.icon}
      </div>

      <h2>
        ยืนยันการแลกของรางวัล
      </h2>

      <p>
        ${r.name}
      </p>

      <div class="profile-level">
        ใช้
        ${formatNumber(r.price)}
        แต้ม
      </div>

      <br>

      <button
        class="primary-btn"
        style="margin-top:18px"
        onclick="
          confirmRedeem('${r.id}')
        "
      >
        ยืนยันการแลก
      </button>

    </div>

  `);
}

function confirmRedeem(id){

  const r =
    rewards.find(
      x=>x.id===id
    );

  if(!r) return;

  state.user.points -=
    r.price;

  state.redemptions.unshift({

    id:Date.now(),

    reward:r.name,

    price:r.price,

    date:"28 ก.ย. 2026"

  });

  state.history.unshift({

    id:
      Date.now()+1,

    type:"spend",

    icon:r.icon,

    title:
      `แลก ${r.name}`,

    date:
      "28 ก.ย. 2026 • ตอนนี้",

    value:r.price

  });

  state.notifications.unshift({

    id:
      Date.now()+2,

    type:"reward",

    title:
      "แลกของรางวัลสำเร็จ 🎉",

    body:
      `คุณแลก ${r.name} แล้ว`,

    time:
      "เมื่อสักครู่",

    unread:true

  });

  saveState();

  closeModal();

  renderAll();

  toast(
    "แลกของรางวัลสำเร็จ 🎁"
  );
}

function renderEarn(){

  document.getElementById(
    "earnList"
  ).innerHTML = [

    [
      "🧴",
      "ขวด PET",
      "20 แต้ม / 1 กก.",
      20
    ],

    [
      "🥫",
      "กระป๋องอลูมิเนียม",
      "30 แต้ม / 1 กก.",
      30
    ],

    [
      "📦",
      "กระดาษ",
      "20 แต้ม / 1 กก.",
      20
    ],

    [
      "💻",
      "E-Waste",
      "100 แต้ม / 1 ชิ้น",
      100
    ],

    [
      "🪫",
      "ถ่านใช้แล้ว",
      "50 แต้ม / 1 ชุด",
      50
    ]

  ]
    .map(x=>`

      <div class="earn-item">

        <div class="earn-icon">
          ${x[0]}
        </div>

        <div>

          <strong>
            ${x[1]}
          </strong>

          <span>
            ${x[2]}
          </span>

        </div>

        <b>
          +${x[3]}
        </b>

      </div>

    `)
    .join("");
}

function renderChart(){

  const vals =
    [110,190,160,240,280];

  const max = 280;

  document.getElementById(
    "barChart"
  ).innerHTML =

    vals.map(v=>`

      <div
        class="bar"
        style="
          height:${Math.round(
            v/max*100
          )}%
        "
      >
        <span>
          ${v}
        </span>
      </div>

    `).join("");
}

function renderHistory(){

  const filter =
    document.getElementById(
      "historyFilter"
    )?.value || "all";

  const arr =
    filter === "all"
      ? state.history
      : state.history.filter(
          x=>x.type===filter
        );

  document.getElementById(
    "historyList"
  ).innerHTML =

    arr.map(h=>`

      <div class="history-item">

        <div class="history-icon">
          ${h.icon}
        </div>

        <div>

          <strong>
            ${h.title}
          </strong>

          <span>
            ${h.date}
          </span>

        </div>

        <div
          class="
            history-value
            ${h.type}
          "
        >
          ${
            h.type==="earn"
              ? "+"
              : "−"
          }

          ${formatNumber(h.value)}

        </div>

      </div>

    `).join("")

    ||

    `
      <div
        style="
          padding:30px;
          text-align:center;
          color:var(--muted)
        "
      >
        ยังไม่มีรายการ
      </div>
    `;
}

function renderNotifications(){

  document.getElementById(
    "notificationList"
  ).innerHTML =

    state.notifications
      .map(n=>`

        <div
          class="
            notification
            ${n.unread ? "unread" : ""}
          "
        >

          <div
            class="notification-icon"
          >
            ${
              n.type === "reward"
                ? "🎁"
                : n.type === "mission"
                  ? "🌱"
                  : "✓"
            }
          </div>

          <div
            class="
              notification-content
            "
          >

            <strong>
              ${n.title}
            </strong>

            <p>
              ${n.body}
            </p>

            <time>
              ${n.time}
            </time>

          </div>

          ${
            n.unread
              ? `
                <span
                  class="pill"
                  style="
                    height:max-content
                  "
                >
                  ใหม่
                </span>
              `
              : ""
          }

        </div>

      `)
      .join("");
}

function bindApp(){

  document.body.addEventListener(
    "click",
    e=>{

      const btn =
        e.target.closest(
          "[data-page]"
        );

      if(btn){
        navigate(
          btn.dataset.page
        );
      }

    }
  );


  document
    .getElementById("checkinBtn")
    .addEventListener(
      "click",
      ()=>{

        if(
          state.checkedDays.includes(28)
        ){

          toast(
            "วันนี้เช็กอินแล้ว"
          );

          return;
        }

        state.checkedDays.push(28);

        state.user.points += 10;

        state.history.unshift({

          id:Date.now(),

          type:"earn",

          icon:"✦",

          title:
            "เช็กอินรายวัน",

          date:
            "28 ก.ย. 2026 • ตอนนี้",

          value:10

        });

        saveState();

        renderAll();

        toast(
          "เช็กอินสำเร็จ +10 แต้ม ✦"
        );

      }
    );


  document
    .getElementById("scanBtn")
    .addEventListener(
      "click",
      ()=>{

        showModal(`

          <div
            style="
              text-align:center
            "
          >

            <div
              style="
                font-size:70px
              "
            >
              ▣
            </div>

            <h2>
              สแกน QR รับแต้ม
            </h2>

            <p>
              ระบบตัวอย่างจำลองหน้าสแกน QR
              สำหรับจุดรับขยะ
              เมื่อเชื่อมกล้องจริง
              สามารถใช้ QR ของจุดรับขยะได้
            </p>

            <button
              class="primary-btn full"
              onclick="
                closeModal();
                toast(
                  'เปิดกล้องจำลองแล้ว'
                )
              "
            >
              เริ่มสแกน
            </button>

          </div>

        `);

      }
    );


  document
    .getElementById("historyFilter")
    .addEventListener(
      "change",
      renderHistory
    );


  document
    .getElementById("categoryRow")
    .addEventListener(
      "click",
      e=>{

        const b =
          e.target.closest(
            ".category-btn"
          );

        if(b){

          currentCategory =
            b.dataset.category;

          renderRewards();

        }

      }
    );


  document
    .getElementById("markAllRead")
    .addEventListener(
      "click",
      ()=>{

        state.notifications
          .forEach(
            n=>{
              n.unread = false;
            }
          );

        saveState();

        renderAll();

        toast(
          "อ่านแจ้งเตือนทั้งหมดแล้ว"
        );

      }
    );


  document
    .getElementById("profileForm")
    .addEventListener(
      "submit",
      e=>{

        e.preventDefault();

        state.user.name =
          document
            .getElementById("editName")
            .value
            .trim();

        state.user.email =
          document
            .getElementById("editEmail")
            .value
            .trim();

        state.user.phone =
          document
            .getElementById("editPhone")
            .value
            .trim();

        state.user.area =
          document
            .getElementById("editArea")
            .value
            .trim();

        saveState();

        renderAll();

        toast(
          "บันทึกโปรไฟล์แล้ว ✓"
        );

      }
    );


  [
    ["toggleMission","mission"],
    ["toggleReward","reward"],
    ["toggleData","data"]
  ].forEach(
    ([id,key])=>{

      document
        .getElementById(id)
        .addEventListener(
          "change",
          e=>{

            state.settings[key] =
              e.target.checked;

            saveState();

            toast(
              "บันทึกการตั้งค่าแล้ว"
            );

          }
        );

    }
  );


  document
    .getElementById("privacyBtn")
    .addEventListener(
      "click",
      ()=>{

        showModal(`

          <h2>
            นโยบายความเป็นส่วนตัว
          </h2>

          <p>
            ตัวอย่างระบบนี้เก็บข้อมูลผู้ใช้งาน
            ไว้ใน localStorage
            ของเบราว์เซอร์เท่านั้น
          </p>

          <p>
            ข้อมูลดังกล่าวไม่ถูกส่งออกไปยัง
            เซิร์ฟเวอร์จริง
            ในเวอร์ชันต้นแบบ
          </p>

        `);

      }
    );


  document
    .getElementById("termsBtn")
    .addEventListener(
      "click",
      ()=>{

        showModal(`

          <h2>
            ข้อกำหนดการใช้งาน
          </h2>

          <ul>

            <li>
              ใช้บัญชีของตนเอง
              ในการรับแต้มและแลกรางวัล
            </li>

            <li>
              แต้มในระบบเป็นข้อมูลจำลอง
              สำหรับต้นแบบ
            </li>

            <li>
              การเชื่อมต่อระบบรับขยะจริง
              ควรตรวจสอบรายการกับ
              จุดรับขยะก่อนบันทึก
            </li>

          </ul>

        `);

      }
    );


  document
    .getElementById("clearDataBtn")
    .addEventListener(
      "click",
      ()=>{

        showModal(`

          <h2>
            ล้างข้อมูลทดลอง?
          </h2>

          <p>
            ข้อมูลแต้ม ภารกิจ
            และประวัติทั้งหมด
            จะกลับไปเป็นค่าเริ่มต้น
          </p>

          <button
            class="primary-btn full"
            onclick="resetDemo()"
          >
            ล้างข้อมูลและเริ่มใหม่
          </button>

        `);

      }
    );


  document
    .getElementById("logoutBtn")
    .addEventListener(
      "click",
      ()=>{

        state.loggedIn = false;

        saveState();

        showAuth();

        toast(
          "ออกจากระบบแล้ว"
        );

      }
    );


  document
    .getElementById("closeModal")
    .addEventListener(
      "click",
      closeModal
    );


  document
    .getElementById("modalBackdrop")
    .addEventListener(
      "click",
      e=>{

        if(
          e.target.id ===
          "modalBackdrop"
        ){

          closeModal();

        }

      }
    );


  document
    .getElementById("globalSearch")
    .addEventListener(
      "input",
      e=>{

        const q =
          e.target.value.trim();

        if(q.length > 1){

          navigate("redeem");

          const filtered =
            rewards.filter(
              r =>
                (
                  r.name +
                  r.category
                )
                  .toLowerCase()
                  .includes(
                    q.toLowerCase()
                  )
            );

          document.getElementById(
            "rewardGrid"
          ).innerHTML =

            filtered

              .map(r=>`

                <article
                  class="reward-card"
                >

                  <div
                    class="reward-image"
                  >
                    ${r.icon}
                  </div>

                  <div
                    class="reward-body"
                  >

                    <h4>
                      ${r.name}
                    </h4>

                    <p>
                      ${r.desc}
                    </p>

                    <div
                      class="reward-foot"
                    >

                      <span
                        class="reward-price"
                      >
                        ✦
                        ${formatNumber(r.price)}
                      </span>

                      <button
                        class="mini-btn"
                        onclick="
                          redeemReward(
                            '${r.id}'
                          )
                        "
                      >
                        แลกเลย
                      </button>

                    </div>

                  </div>

                </article>

              `)
              .join("")

            ||

            `
              <p class="muted">
                ไม่พบของรางวัล
              </p>
            `;

        }

      }
    );


  document
    .getElementById("mobileMenu")
    .addEventListener(
      "click",
      ()=>{
        toast(
          "บนมือถือใช้เมนูด้านล่างเพื่อเปลี่ยนหน้า"
        );
      }
    );
}

function resetDemo(){

  localStorage.removeItem(
    STORAGE_KEY
  );

  state =
    loadState();

  closeModal();

  showApp();

  toast(
    "รีเซ็ตข้อมูลทดลองแล้ว"
  );
}

window.claimMission =
  claimMission;

window.redeemReward =
  redeemReward;

window.confirmRedeem =
  confirmRedeem;

window.closeModal =
  closeModal;

window.resetDemo =
  resetDemo;

document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    setupAuth();

    bindApp();

    setTimeout(
      ()=>{
        if(state.loggedIn){
          showApp();
        }else{
          showAuth();
        }
      },
      900
    );

  }
);
