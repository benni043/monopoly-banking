<script setup lang="ts">
let color = ref("blue");

function onPlayerCard(color: string) {
  $fetch("/api/playerCard/", {
    method: "POST",
    body: JSON.stringify({ color }),
  });
}

let id = ref(0);
function onPropertyCard(id: number) {
  $fetch("/api/property/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

let lineId = ref(0);
function onLineCard(id: number) {
  $fetch("/api/line/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

let companyId = ref(0);
function onCompanyCard(id: number) {
  $fetch("/api/company/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

let bankCardId = ref(0);
function onBankCard(id: number) {
  $fetch("/api/bankCard/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

let riskCardId = ref(0);
function onRiskCard(id: number) {
  $fetch("/api/riskCard/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

function onOutOfJailCard() {
  $fetch("/api/jail/oufOfJail/", { method: "POST" });
}

function onGetJailCard() {
  $fetch("/api/jail/getJailCard/", { method: "POST" });
}

function onBankTradeCard() {
  $fetch("/api/bankTradeCard/", { method: "POST" });
}

let payAmount = ref(0);
function onPay(amount: number) {
  $fetch("/api/pay/", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

function payPropertyLevy() {
  $fetch("/api/propertyLevy/", { method: "POST" });
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-center mb-6 text-indigo-700">
      Monopoly API Tester
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Player Card -->
      <div class="bg-white p-4 rounded-xl shadow-md">
        <h2 class="text-lg font-semibold mb-2 text-gray-800">Player Card</h2>
        <div class="flex gap-2">
          <button
            class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg"
            @click="onPlayerCard(color)"
          >
            Send Player Card
          </button>
          <select
            class="border px-3 py-2 rounded-lg bg-gray-50"
            v-model="color"
          >
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>
      </div>

      <!-- Property / Line / Company -->
      <div class="bg-white p-4 rounded-xl shadow-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Properties</h2>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="id"
            type="number"
          />
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onPropertyCard(id)"
          >
            Property
          </button>
        </div>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="lineId"
            type="number"
          />
          <button
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onLineCard(lineId)"
          >
            Line
          </button>
        </div>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="companyId"
            type="number"
          />
          <button
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onCompanyCard(companyId)"
          >
            Company
          </button>
        </div>
      </div>

      <!-- Bank & Risk Cards -->
      <div class="bg-white p-4 rounded-xl shadow-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Bank / Risk Cards</h2>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="bankCardId"
            type="number"
          />
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onBankCard(bankCardId)"
          >
            Bank Card
          </button>
        </div>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="riskCardId"
            type="number"
          />
          <button
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onRiskCard(riskCardId)"
          >
            Risk Card
          </button>
        </div>
      </div>

      <!-- Pay & Special Actions -->
      <div class="bg-white p-4 rounded-xl shadow-md space-y-4">
        <h2 class="text-lg font-semibold text-gray-800">Payments & Actions</h2>
        <div class="flex gap-2">
          <input
            class="border px-3 py-2 rounded-lg flex-1"
            v-model="payAmount"
            type="number"
          />
          <button
            class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex-1"
            @click="onPay(payAmount)"
          >
            Pay
          </button>
        </div>
        <button
          class="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
          @click="onBankTradeCard"
        >
          Bank Trade Card
        </button>
        <button
          class="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          @click="payPropertyLevy"
        >
          Pay Property Levy
        </button>
        <button
          class="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
          @click="onOutOfJailCard"
        >
          Go to Jail
        </button>
        <button
          class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          @click="onGetJailCard"
        >
          Get Out of Jail
        </button>
      </div>
    </div>
  </div>
</template>
