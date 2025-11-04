#!/bin/bash

echo "🚀 Deploying Income Receivables API..."

# 1. Apply database migration
echo "📊 Applying database migration..."
supabase db reset --linked

# 2. Deploy Edge Function
echo "🔧 Deploying Edge Function..."
supabase functions deploy create-income-receivable

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test the API endpoint: POST /functions/v1/create-income-receivable"
echo "2. Verify the frontend integration"
echo "3. Check the income_receivables table in the database"























