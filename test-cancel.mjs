// test-cancel.mjs
// Проверка триггера cancellation_window_closed от имени реального
// авторизованного пользователя (не service role, как в SQL Editor).
//
// Запуск:
//   node test-cancel.mjs
//
// Перед запуском впишите ниже:
//   - email/пароль тестового tutor-пользователя (того, что создавали
//     через Dashboard → Authentication → Users)
//   - id брони, которую хотите попробовать отменить
//   - id самого tutor-пользователя (cancelled_by)

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- впишите свои значения ---
const TUTOR_EMAIL = "artjomsamokater@gmail.com"; // тот, что создали вторым
const TUTOR_PASSWORD = "artemon2009";
const BOOKING_ID = "5e91a898-16af-4e46-8442-60581e89aa3d";
const TUTOR_ID = "f6d5e187-cf75-4058-a828-a3bb5e01f673";
// ------------------------------

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Нет NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY в окружении.\n" +
    "Запускайте так (PowerShell):\n" +
    '  $env:NEXT_PUBLIC_SUPABASE_URL="https://ltsqmkxrbzcmkizonmow.supabase.co"; ' +
    '$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0c3Fta3hyYnpjbWtpem9ubW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MDA5NTUsImV4cCI6MjEwNDA3Njk1NX0.cekm9S5DdKbWor947oks7XjLejn6iqVn2ha-"; node test-cancel.mjs'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log("Логинимся как", TUTOR_EMAIL, "...");
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: TUTOR_EMAIL,
      password: TUTOR_PASSWORD,
    });

  if (authError) {
    console.error("Ошибка логина:", authError.message);
    process.exit(1);
  }
  console.log("Залогинены как user_id:", authData.user.id);

  console.log("Пробуем отменить бронь", BOOKING_ID, "...");
  const { data, error } = await supabase
    .from("bookings")
   .update({ status: "cancelled", cancelled_by: "00000000-0000-0000-0000-000000000000" })
    .eq("id", BOOKING_ID)
    .select();

  if (error) {
    console.log("\n✅ Ожидаемо: запрос отклонён.");
    console.log("Текст ошибки:", error.message);
    console.log("Код:", error.code);
  } else {
    console.log("\n⚠️ Запрос прошёл без ошибки. Результат:", data);
    console.log(
      "Если start_at был < 3 часов от сейчас — это означает, что триггер НЕ сработал."
    );
  }
}

main();
