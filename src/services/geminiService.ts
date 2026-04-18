const PREDEFINED_ADVICE: Record<string, string> = {
  'stress': "Có vẻ bạn đang phải chịu nhiều áp lực. Hãy để những giai điệu này giúp bạn giãn cơ và hít thở sâu hơn nhé. Mọi chuyện rồi sẽ ổn thôi.",
  'buồn': "Nỗi buồn đôi khi là một phần của hành trình lớn lên. Hãy cứ để bản thân cảm nhận, đừng kìm nén. Chúng mình luôn bên bạn.",
  'mất động lực': "Đừng quá khắt khe với bản thân nếu hôm nay bạn chưa làm được gì nhiều. Đôi khi nghỉ ngơi chính là cách tốt nhất để sạc lại năng lượng.",
  'mệt mỏi': "Cơ thể bạn đang lên tiếng đòi được nghỉ ngơi. Hãy nhắm mắt lại một chút, để tâm trí được tự do bay bổng cùng âm thanh.",
  'cô đơn': "Bạn không đơn độc trong cảm giác này. Có hàng ngàn tâm hồn khác cũng đang tìm kiếm sự kết nối như bạn. Hãy cùng lắng nghe nhé.",
  'default': "Hãy hít thở thật sâu. Chúng mình đã chuẩn bị những nội dung đặc biệt để vỗ về tâm hồn bạn ngay lúc này."
};

export async function getMoodAdvice(mood: string, note?: string) {
  // Giả lập hiệu ứng hệ thống đang xử lý
  await new Promise(resolve => setTimeout(resolve, 1000));
  return PREDEFINED_ADVICE[mood] || PREDEFINED_ADVICE['default'];
}

export async function getRecommendedTracks(mood: string, allTracks: any[]) {
  // Giả lập hiệu ứng quét dữ liệu
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const recommended = allTracks
    .filter(t => t.mood.some((m: string) => m.toLowerCase().includes(mood.toLowerCase())))
    .slice(0, 3)
    .map(t => t.id);

  return {
    recommendedIds: recommended,
    reason: `Dựa trên tần số cảm xúc của bạn, chúng mình gợi ý danh sách 'Artifacts' này để giúp bạn cân bằng lại trạng thái: ${mood}.`
  };
}
