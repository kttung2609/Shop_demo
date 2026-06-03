const express = require('express');
const router = express.Router();
const db = require('../db');


const searchProductInDB = (keyword) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, description, new_price, old_price, material, weight, max_tension, balance_point, stiffness, stock
      FROM products 
      WHERE name LIKE ? OR description LIKE ?
      LIMIT 1
    `;
    const searchTerm = `%${keyword}%`;
    
    db.query(sql, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};


const getMockAIResponse = (message, productData = null) => {

  if (productData) {
    let consultation = `🎾 **Thông tin sản phẩm: ${productData.name}**\n\n`;
    consultation += `💰 **Giá:** ${productData.new_price.toLocaleString()}đ`;
    if (productData.old_price > productData.new_price) {
      consultation += ` (Giảm từ ${productData.old_price.toLocaleString()}đ)`;
    }
    consultation += `\n`;
    
    if (productData.description) {
      consultation += `📝 **Mô tả:** ${productData.description}\n`;
    }
    
    if (productData.material) {
      consultation += `📦 **Chất liệu:** ${productData.material}\n`;
    }
    
    if (productData.weight) {
      consultation += `⚖️ **Trọng lượng:** ${productData.weight}g\n`;
    }
    
    if (productData.max_tension) {
      consultation += `🔊 **Độ căng tối đa:** ${productData.max_tension}\n`;
    }
    
    if (productData.balance_point) {
      consultation += `⚡ **Điểm cân bằng:** ${productData.balance_point}\n`;
    }
    
    if (productData.stiffness) {
      consultation += `💪 **Độ cứng:** ${productData.stiffness}\n`;
    }
    
    consultation += `📦 **Tồn kho:** ${productData.stock > 0 ? 'Còn hàng ✅' : 'Hết hàng ❌'}\n`;
    consultation += `\n✨ Bạn có muốn biết thêm gì về sản phẩm này không?`;
    
    return consultation;
  }

  const responses = {
    'giúp': 'Tôi có thể giúp bạn với các câu hỏi về sản phẩm, đơn hàng, hoặc bất kỳ vấn đề nào. Bạn cần trợ giúp gì?',
    'sản phẩm': 'Chúng tôi có nhiều sản phẩm thể thao chất lượng cao. Bạn tìm kiếm loại sản phẩm nào?',
    'đơn hàng': 'Bạn có thể kiểm tra trạng thái đơn hàng của mình tại trang "Đơn hàng" trong hồ sơ cá nhân.',
    'thanh toán': 'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, ví điện tử, và chuyển khoản ngân hàng.',
    'ship': 'Chúng tôi cung cấp dịch vụ giao hàng toàn quốc. Phí ship thường từ 30k-100k tùy khoảng cách.',
    'trả hàng': 'Bạn có thể trả hàng trong vòng 7 ngày nếu sản phẩm không đúng yêu cầu. Liên hệ với chúng tôi để biết thêm chi tiết.',
    'default': 'Cảm ơn bạn đã hỏi! Tôi hiểu bạn muốn biết về: ' + message + '. Vui lòng liên hệ với bộ phận hỗ trợ khách hàng để được trợ giúp chi tiết hơn.',
  };

  for (const key in responses) {
    if (key !== 'default' && message.toLowerCase().includes(key.toLowerCase())) {
      return responses[key];
    }
  }
  
  return responses['default'];
};

router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message không được để trống' });
    }

    let productData = null;
    try {
      productData = await searchProductInDB(message);
    } catch (error) {
      console.error('Database search error:', error);
    }

    const reply = getMockAIResponse(message, productData);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
