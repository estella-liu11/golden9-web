-- 🚨 警告：此脚本将删除所有现有的数据表，请确保您不需要保留任何旧数据。
-- ----------------------------------------------------------------------
-- 1. users (用户表)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS leaderboard;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'standard',
    points INTEGER DEFAULT 0, -- 参赛积分等级展示用
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);


-- ----------------------------------------------------------------------
-- 2. events (赛事表)
-- ----------------------------------------------------------------------
CREATE TABLE events (
    event_id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    creator_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- 引用创建赛事的用户
    fee NUMERIC(10, 2) DEFAULT 0.00,
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_time ON events (start_time);
CREATE INDEX idx_events_status ON events (status);


-- ----------------------------------------------------------------------
-- 3. products (商品展示表) - 仅供展示，无交易逻辑
-- ----------------------------------------------------------------------
CREATE TABLE products (
    product_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- 仅供展示的价格
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_category ON products (category);


-- ----------------------------------------------------------------------
-- 4. leaderboard (排行榜表) - 存储用户在特定榜单上的表现
-- ----------------------------------------------------------------------
CREATE TABLE leaderboard (
    leaderboard_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL, -- 关联用户
    score INTEGER NOT NULL, -- 用户的分数或排名指标
    category VARCHAR(100) NOT NULL, -- 榜单类型 (e.g., 'monthly_ranking', 'tournament_A', 'high_score')
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 确保同一个用户在同一榜单类型下只有一个记录 (可以根据需求调整)
    UNIQUE (user_id, category) 
);
CREATE INDEX idx_leaderboard_score ON leaderboard (score DESC);
CREATE INDEX idx_leaderboard_user_category ON leaderboard (user_id, category);