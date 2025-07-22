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

let bankCardId = ref(0);

function onBankCard(id: number) {
  $fetch("/api/bankCard/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

let risikoCardId = ref(0);

function onRisikoCard(id: number) {
  $fetch("/api/risikoCard/", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}

function onOutOfJailCard() {
  $fetch("/api/jail/oufOfJail/", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

function onGetJailCard() {
  $fetch("/api/jail/getJailCard/", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

function onBankTradeCard() {
  $fetch("/api/bankTradeCard/", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

let payAmount = ref(0);

function onPay(amount: number) {
  $fetch("/api/pay/", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

function payPropertyLevy() {
  $fetch("/api/propertyLevy/", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">monopoly api</h1>

    <div class="flex gap-2 flex-col">
      <div class="flex gap-2">
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onPlayerCard(color)"
        >
          send Player card
        </button>
        <select class="border px-2 rounded" v-model="color">
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
        </select>
      </div>
      <div class="flex gap-2">
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onPropertyCard(id)"
        >
          send Property card
        </button>
        <input class="border px-2 rounded" v-model="id" type="number" />
      </div>
      <div class="flex gap-2">
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onBankCard(bankCardId)"
        >
          send bank card
        </button>
        <input class="border px-2 rounded" v-model="bankCardId" type="number" />
      </div>
      <div class="flex gap-2">
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onRisikoCard(risikoCardId)"
        >
          send risiko card
        </button>
        <input
          class="border px-2 rounded"
          v-model="risikoCardId"
          type="number"
        />
      </div>
      <div class="flex gap-2">
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onPay(payAmount)"
        >
          pay
        </button>
        <input class="border px-2 rounded" v-model="payAmount" type="number" />
      </div>
      <div>
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onBankTradeCard"
        >
          send Banktrade card
        </button>
      </div>
      <div>
        <button
          class="cursor-pointer border px-2 rounded"
          @click="payPropertyLevy"
        >
          send payPropertyLevy card
        </button>
      </div>
      <div>
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onOutOfJailCard"
        >
          send go to Jail
        </button>
      </div>
      <div>
        <button
          class="cursor-pointer border px-2 rounded"
          @click="onGetJailCard"
        >
          send get Jail free card
        </button>
      </div>
    </div>
  </div>
</template>
