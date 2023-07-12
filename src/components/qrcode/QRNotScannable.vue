<template>
  <VDropdown>
    <div text-center op35 mt--2 italic text-sm>
      <button>Not scannable?</button>
    </div>
    <template #popper>
      <div w-120 max-w-screen class="prose" p4>
        <p>
          It might not work on all scanners.
        </p>

        <p>
          On iPhone, it's recommanded to use the code scanner from Control Center instead of the Camera app.
        </p>
        <img src="/images/ios-qrcode-scanner.jpg" rounded-lg alt="qr-code-scanner" class="mt--3! mb-0! w-60!">

        <p>
          You can also try WeChat if you have it installed.
        </p>
        <p>
          Otherwise, please let me know if there any good QR code scanner you'd recommand for other platforms.
        </p>
      </div>
    </template>
  </VDropdown>
</template>
